const mongoose = require("mongoose");
const fs = require("fs");
require("dotenv").config();

// Define Listing Schema
const listingSchema = new mongoose.Schema({
  name: String,
  room_type: String,
  address: {
    street: String,
  },
  summary: String,
  price: Number,
  beds: Number,
  bed_type: String,
  neighbourhood_overview: String,
  picture: String,
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI; // Get MongoDB URI from the environment variable

// Check if MONGO_URI is set correctly
if (!MONGO_URI) {
  console.error("MongoDB URI is not defined in .env file");
  process.exit(1); // Exit the application if the URI is not set
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// Create Model
const Listing = mongoose.model("Listing", listingSchema, "listingAndReviews");

// Read JSON File
const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

// Insert Data
const insertData = async () => {
  try {
    await Listing.insertMany(data);
    console.log("Data successfully inserted!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error inserting data:", err);
  }
};

insertData();
