const express = require("express");
const functions = require("firebase-functions");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const cors = require("cors");
const whatsApproute = require("./src/router/routes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
  })
);

app.get("/", (req, res) =>
  res.json({ message: "whatsapp helper working good" })
);
app.use("/api/v1/", whatsApproute);
// Error handling
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`🚀 WhatsApp API running on port ${PORT}`);
//   console.log(`📱 Health: http://localhost:${PORT}/api/v1/health`);
// });

let cachedServer = null;

module.exports["oa_whatsapp_helper"] = functions.https.onRequest(
  {
    region: "asia-south1",
    // cpu: 1,
    // concurrency: 50,
    // timeoutSeconds: 540,
  },
  (req, res) => {
    if (!cachedServer) {
      console.log("Initializing Express server...");
      cachedServer = app;
    }
    return cachedServer(req, res);
  }
);
