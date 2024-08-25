const mongoose = require("mongoose");
const env = require("./environment");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(env.db);
  console.log("Connected to database");
}
