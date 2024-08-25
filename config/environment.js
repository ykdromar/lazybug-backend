const fs = require("fs");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, `../${process.env.NODE_ENV}.env`), // Setting path to .env file corresponding to run environment
});

module.exports = {
  env: process.env.NODE_ENV || "dev",
  port: process.env.PORT || 8000,
  chat_socket_origin: process.env.CHAT_SOCKET_ORIGIN,
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db: process.env.DB,
  jwt_secretOrKey: process.env.JWT_SECRET_OR_KEY,
  server_ip_address: process.env.SERVER_IP_ADDRESS,
  bucket: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  },
  bucket_name: process.env.BUCKET_NAME,
};
