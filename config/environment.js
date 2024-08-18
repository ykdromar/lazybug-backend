const fs = require("fs");
const rfs = require("rotating-file-stream");
const path = require("path");
require("dotenv").config();
const logDir = path.join(__dirname, "../production_logs");
fs.existsSync(logDir) || fs.mkdirSync(logDir);
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d",
  path: logDir,
});

const production = {
  name: "production",
  assets_path: "./assets",
  session_cookie_key: process.env.SESSION_COOKIE_KEY,
  db: process.env.DB,
  smtp: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_AUTH_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  jwt_secretOrKey: process.env.JWT_SECRET_OR_KEY,
  morgan: {
    mode: "combined",
    options: { stream: accessLogStream },
  },
  server_ip_address: "65.1.73.133",
  BUCKET: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  },
  BUCKET_NAME: "lazybug",
};

module.exports = production;
