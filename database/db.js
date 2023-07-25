const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const mongoURI = process.env.CONNECTION_STRING;
mongoose.set("strictQuery", false);

const connectToMongoose = () => {
  mongoose.connect(mongoURI);
  
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully');
  });
  
  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};

module.exports = connectToMongoose;
