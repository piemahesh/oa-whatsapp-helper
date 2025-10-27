const express = require("express");
const functions = require("firebase-functions");
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); // ✅ import helper
require("dotenv").config();
const cors = require("cors");
const whatsApproute = require("./src/router/routes");
const { MONGO_URI, MONGO_OPTIONS } = require("./src/constants/mongo_constants");
const mongoose = require("mongoose");
const { isProduction } = require("./src/utils");

const app = express();

app.set("trust proxy", true);
app.use(cors());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) =>
      req.originalUrl === "/api/v1/webhook" && req.method === "GET",
    keyGenerator: (req) => {
      // ✅ Fallback if IP is missing (required for Firebase / Meta webhook)
      const fallbackIP = req.ip || req.headers["x-forwarded-for"] || "::1";
      return ipKeyGenerator(fallbackIP);
    },
  })
);

// MongoDB Connection Singleton
let mongoConnection = null;

const connectToMongoDB = async () => {
  if (!mongoConnection) {
    console.log("Connecting to MongoDB...");
    try {
      // console.log(MONGO_OPTIONS, MONGO_URI);
      mongoConnection = await mongoose.connect(MONGO_URI, MONGO_OPTIONS);
      console.log("Connected to MongoDB!");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error.message);
      mongoConnection = null; // Reset if connection fails
      throw error;
    }
  }
  return mongoConnection;
};

// Ensure MongoDB Connection Middleware
app.use(async (_, res, next) => {
  try {
    if (!mongoConnection) {
      console.log("Establishing MongoDB connection...");
      await connectToMongoDB();
    }
    next();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Health/test route
app.get("/", (req, res) =>
  res.json({ message: "whatsapp helper working good" })
);
app.use("/api/v1/", whatsApproute);

const functionName = isProduction
  ? "oa_whatsapp_helper"
  : "oa_whatsapp_helper_test";

module.exports[functionName] = functions.https.onRequest(
  { region: "asia-south1" },
  (req, res) => {
    console.log("Initializing Express server...");
    return app(req, res);
  }
);
