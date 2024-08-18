const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const env = require("../../../config/environment");
const aws = require("aws-sdk");
const fs = require("fs");
// login
module.exports.verify = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid Username/Password",

        data: {},
        success: false,
      });
    }
    return res.status(200).json({
      message: "Authorized !",

      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
        token: jwt.sign(user.toJSON(), env.jwt_secretOrKey, {
          expiresIn: 3600000,
        }),
      },
      success: true,
    });
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({
      data: {},
      success: false,
      message: "Internal serve Error",
    });
  }
};
// signup
module.exports.signup = async function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.status(422).json({
      success: false,
      data: {},
      message: "Password and Confirm Password does not match",
    });
  }
  User.findOne({ email: req.body.email }, function (error, user) {
    if (error) {
      return res.status(500).json({
        success: false,
        data: {},
        message: error,
      });
    }
    if (!user) {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: "",
        },
        function (error, user) {
          if (error) {
            return res.status(500).json({
              success: false,
              data: {},
              message: error,
            });
          }

          return res.status(200).json({
            success: true,
            data: {},
            message: "User Created Successfully",
          });
        }
      );
    } else {
      return res.status(422).json({
        success: false,
        data: {},
        message: "User already exits",
      });
    }
  });
};

//edit user
module.exports.editUser = async function (req, res) {
  console.log(req.body);
  if (req.body.password === req.body.confirm_password) {
    console.log(req.body);
    let user = await User.findById(req.user._id);
    if (user) {
      if (req.file != null) {
        aws.config.setPromisesDependency();
        aws.config.update(env.BUCKET);
        const s3 = new aws.S3();
        var params = {
          ACL: "public-read",
          ContentType: "image/png, image/jpeg, image/jpg",
          Bucket: env.BUCKET_NAME,
          Body: fs.createReadStream(req.file.path),
          Key: `${req.file.fieldname}-${Date.now()}.${
            req.file.originalname.split(".")[1]
          }`,
        };
        s3.upload(params, (err, data) => {
          if (err) {
            console.log(
              "Error occured while trying to upload to S3 bucket",
              err
            );
          }

          if (data) {
            fs.unlinkSync(req.file.path); // Empty temp folder
            const locationUrl = data.Location;
            console.log(locationUrl, user.avatar);
            user.avatar = locationUrl;
          }
          if (req.body.name) {
            user.name = req.body.name;
          }
          user.password = req.body.password;
          user.save();
          return res.status(200).json({
            success: true,
            data: {
              user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              },
              token: jwt.sign(user.toJSON(), env.jwt_secretOrKey, {
                expiresIn: 3600000,
              }),
            },
            message: "User Info updated",
          });
        });
      } else {
        if (req.body.name) {
          user.name = req.body.name;
        }
        user.password = req.body.password;
        user.save();
        return res.status(200).json({
          success: true,
          data: {
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
            },
            token: jwt.sign(user.toJSON(), env.jwt_secretOrKey, {
              expiresIn: 3600000,
            }),
          },
          message: "User Info updated",
        });
      }
    } else {
      return res.status(422).json({
        success: false,
        data: {},
        message: "User not found",
      });
    }
  } else {
    return res.status(422).json({
      success: false,
      data: {},
      message: "Password and Confirm Password not match",
    });
  }
};

// user info

module.exports.userInfo = async function (req, res) {
  try {
    let user = await User.findById(req.params.userId);
    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
      message: "User Info get Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error,
    });
  }
};
//user search

module.exports.searchUser = async function (req, res) {
  try {
    let users = await User.find({ name: req.query.text }).select({
      password: 0,
    });
    return res.status(200).json({
      success: true,
      data: {
        users: users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: error,
    });
  }
};

// follow user

module.exports.followUser = async function (req, res) {
  try {
    let toUser = await User.findById(req.query.to_user);
    let forUser = await User.findById(req.query.for_user);
    let followingArray = toUser.followings;
    let followerArray = forUser.followers;
    followingArray.push({
      _id: forUser._id,
      name: forUser.name,
      email: forUser.email,
    });
    toUser.save();

    followerArray.push({
      _id: toUser._id,
      name: toUser.name,
      email: toUser.email,
    });
    forUser.save();
    return res.status(200).json({
      success: true,
      data: {
        forUser: {
          _id: forUser._id,
          name: forUser.name,
          email: forUser.email,
        },
      },
      message: `You started following ${forUser.name}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      data: {},
      message: "something went wrong",
    });
  }
};
