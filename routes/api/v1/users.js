const express = require("express");
const passport = require("passport");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const users_API = require("../../../controllers/api/v1/users_api");
router.post("/login", users_API.verify);
router.post("/signup", users_API.signup);
router.get("/search", users_API.searchUser);
router.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  multer({ dest: path.join(__dirname, "uploads") }).single("avatar"),
  users_API.editUser
);
router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  users_API.userInfo
);
router.post(
  "/follow",
  passport.authenticate("jwt", { session: false }),
  users_API.followUser
);
module.exports = router;
