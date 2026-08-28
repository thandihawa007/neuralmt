/**
 * db.js
 * ------
 * Mongoose connection helper.
 * Call connectDB() once at server startup; subsequent Mongoose calls
 * reuse the cached connection automatically.
 */

const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "[db] MONGODB_URI is not set — translation history will be disabled."
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("[db] MongoDB connection error:", err.message);
    // Do NOT crash the process — history is optional
  }
};

module.exports = { connectDB };
