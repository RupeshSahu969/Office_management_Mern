// config/db.js
const mongoose = require("mongoose");

const connectDB = () => {
  return new Promise((resolve, reject) => {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    
    const conn = mongoose.connection;

    conn.on("connected", () => {
      console.log("MongoDB Connected");
      resolve(); 
    });

    conn.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      reject(err);
    });
  });
};

module.exports = connectDB;
