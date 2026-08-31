/**
 * server.js
 * ---------
 * Express API gateway for the Neural Machine Translator.
 *
 * Start with:
 *   node server.js
 *
 * Environment variables (backend/.env):
 *   PORT=5000
 *   ML_SERVICE_URL=http://localhost:8000
 *   MONGODB_URI=mongodb://localhost:27017/neuralmt   (optional)
 */

"use strict";

require("dotenv").config();
const express = require("express");
const cors    = require("cors");

const { connectDB }      = require("./config/db");
const translateRouter    = require("./routes/translate");

const app  = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

// Allow requests only from the Vite frontend
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json({ limit: "64kb" }));   // JSON body parsing, 64 KB cap

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
// Global error handler — ensures Express never crashes on unhandled throws
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ---------------------------------------------------------------------------
// Startup
// ---------------------------------------------------------------------------
(async () => {
  // MongoDB is optional — connectDB() logs a warning but does not exit
  await connectDB();

  app.listen(PORT, () => {
    console.log(`[server] Backend running  → http://localhost:${PORT}`);
    console.log(`[server] ML service URL   → ${process.env.ML_SERVICE_URL || "http://localhost:8000"}`);
    console.log(`[server] CORS origin      → http://localhost:5173`);
  });
})();
