const express = require("express");
const path = require("path");
const router = express.Router();
router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});
router.use("/api", require("./api"));
router.get("/.well-known/pki-validation/:name", (req, res, next) => {
  const options = {
    root: path.join(__dirname, "../ssl/"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  const fileName = req.params.name;
  res.sendFile(fileName, options, (err) => {
    // if (err) {
    //   next(err)
    // } else {
    //   console.log('Sent:', fileName)
    // }
    next();
  });
});

router.get("/:name", (req, res, next) => {
  const options = {
    root: path.join(__dirname, "../load_testing/"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  const fileName = req.params.name;
  res.sendFile(fileName, options, (err) => {
    // if (err) {
    //   next(err)
    // } else {
    //   console.log('Sent:', fileName)
    // }
    next();
  });
});

module.exports = router;
