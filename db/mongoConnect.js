const mongoose = require('mongoose');
const { config } = require('../config/secret');

main().catch(err => console.log(err));

async function main() {
 
  await mongoose.connect(`mongodb+srv://avi:${config.password}@cluster0.r1mnv.mongodb.net/marcet_avi`);

  console.log("mongo connected!!!");
}


{
 
//   await mongoose.connect(`mongodb+srv://avi:P3n)wDDf+S)VbyX@cluster0.r1mnv.mongodb.net/marcet_avi`);

//   console.log("mongo connected!!!");
}


