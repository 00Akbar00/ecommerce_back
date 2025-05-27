const express = require("express");
const connectDB = require("./config/db");
const apiRoutes = require("./routes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

module.exports = app;
