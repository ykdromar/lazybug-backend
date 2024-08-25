const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const server = require("http").createServer(app);
app.use(cors());
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
const path = require("path");
const env = require("./config/environment");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportJWT = require("./config/passport-jwt-strategy");
const chatSocket = require("./config/chat_sockets.js").chatSockets(server);
const port = env.port;

app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(passport.initialize());
//use express router
app.use("/", require("./routes"));

server.listen(port, function (error) {
  if (error) {
    console.log(`Error in running server: ${error}`);
  }
  console.log(`Server is running on port:${port}`);
});
