const express = require("express");
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

app.use("/api/v1/", whatsApproute);
// Error handling
app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 WhatsApp API running on port ${PORT}`);
  console.log(`📱 Health: http://localhost:${PORT}/api/v1/health`);
});

module.exports = app;
