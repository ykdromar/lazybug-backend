const Post = require("../../../models/post");
const Comment = require("../../../models/comment");
module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user", ["name", "email", "avatar"])
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    });

  return res.status(200).json({
    success: true,
    data: {
      message: "Lists of posts",
      posts: posts,
    },
  });
};

module.exports.delete = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);
    if (post.user == req.user.id) {
      post.remove();
      await Comment.deleteMany({ post: req.params.id });

      return res.status(200).json({
        data: {
          message: "Post & associated comments deleted successfully",
        },
        success: true,
      });
    } else {
      return res.status(401).json({
        data: {
          message: "You are unauthorize to delete this post",
        },
        success: false,
      });
    }
  } catch (error) {
    console.log("Error in deleting a post", error);
    return res.status(500).json({
      data: {
        message: "Internal server error",
      },
      success: false,
    });
  }
};
module.exports.create = async function (req, res) {
  Post.create(
    {
      content: req.body.content,
      user: req.user._id,
    },
    async function (err, post) {
      if (err) {
        return res.status(500).json({
          success: false,
          data: {
            message: "Internal server error",
          },
        });
      }
      let postData = await post.populate("user");
      return res.status(200).json({
        success: true,
        data: {
          post: postData,
          message: "Post created successfully",
        },
      });
    }
  );
};
