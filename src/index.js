const express = require("express");
const dotenv = require("dotenv").config();
const dbConnect = require("./config/dbConnect");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const logRoutes = require("./routes/logRoutes");

dbConnect();

const app = express();

// Middleware
app.use(express.json());

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Routes
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/logs", logRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 7002;
app.listen(PORT,() => {
    console.log(`Server is running at ${PORT}`);
});
