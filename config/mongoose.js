const mongoose=require('mongoose');
const env=require('./environment');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://localhost:27017/${env.db}`);
 console.log("Connected to database"); 
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

// module.exports=main;