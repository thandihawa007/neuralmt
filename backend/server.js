/**
 * server.js
 * ---------
 * Express API gateway for the Neural Machine Translator.
 *
 * Start with:
 *   node server.js         (production)
 *   npx nodemon server.js  (development)
 */

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const translateRouter = require("./routes/translate");

const app = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors());               // Allow all origins in local dev
app.use(express.json());       // Parse JSON request bodies

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/translate", translateRouter);

// ---------------------------------------------------------------------------
// 404 catch-all
// ---------------------------------------------------------------------------
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
const start = async () => {
  // MongoDB is optional — connectDB() warns but does not crash on failure
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] Backend running on http://localhost:${PORT}`);
    console.log(`[server] ML service URL: ${process.env.ML_SERVICE_URL || "http://localhost:8000"}`);
  });
};

start();
