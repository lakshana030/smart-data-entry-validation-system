const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const pool = require("./config/db");

const app = express();

// ============================
// 🔒 SECURITY MIDDLEWARE
// ============================
app.use(helmet({
  contentSecurityPolicy: false // disabled temporarily to avoid blocking frontend scripts/styles without proper setup
}));
app.use(cors());
app.use(express.json());

// ============================
// 🌐 SERVE STATIC FRONTEND
// ============================
// Serve the frontend folder directly from root
app.use(express.static(path.join(__dirname, "../frontend")));

// ============================
// 🔀 API ROUTES
// ============================
app.use("/api", userRoutes);

// ============================
// 🌍 GLOBAL ERROR HANDLER
// ============================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ============================
// 🚀 SERVER START
// ============================
const PORT = process.env.PORT || 5000;

// Auto-initialize DB before starting
async function startServer() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS data_entries (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password VARCHAR(255) NOT NULL
      )
    `);
    console.log("Database initialized successfully.");
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}

startServer();
