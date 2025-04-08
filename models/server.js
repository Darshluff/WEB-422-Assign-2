/********************************************************************************
 *  WEB422 – Assignment 2
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 *  Name:Darsh Parmar Student ID:151958238 Date:2025-01-31
 *
 ********************************************************************************/

// Import required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Load environment variables from .env file

const app = express();
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// Catch-all route to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Enable CORS for frontend communication
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// MongoDB connection string from the .env file
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

// Define the Listing schema
const listingSchema = new mongoose.Schema({
  name: String,
  room_type: String,
  address: { street: String, city: String },
  summary: String,
  price: Number,
  bed_type: String,
  beds: Number,
  picture: String,
  neighbourhood_overview: String,
});

// Create the Listing model based on the schema
const Listing = mongoose.model("listing", listingSchema, "listingAndReviews");

// API route to fetch all listings
app.get("/api/listings", async (req, res) => {
  const { page = 1, perPage = 10, name } = req.query;
  const query = name ? { name: new RegExp(name, "i") } : {}; // Search by name (case insensitive)

  try {
    const listings = await Listing.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// API route to fetch a specific listing by its ID

app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch listing details" });
  }
});

// Start the server on the specified port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
