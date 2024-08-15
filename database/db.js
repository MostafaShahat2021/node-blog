const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true); // improve data validation and potential error handling
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected Successfully ${connect.connection.host}`);
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

module.exports = connectDB;