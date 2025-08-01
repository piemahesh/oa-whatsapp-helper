// const express = require("express");
// const functions = require("firebase-functions");
// const rateLimit = require("express-rate-limit");
// require("dotenv").config();
// const cors = require("cors");
// const whatsApproute = require("./src/router/routes");
// const app = express();

// // Middleware
// // ✅ Safely trust proxy only for Google Cloud / localhost
// app.set("trust proxy", (ip) => {
//   console.log("Client IP:", ip);
//   return (
//     ip.startsWith("35.") ||
//     ip.startsWith("34.") ||
//     ip === "::1" ||
//     ip.startsWith("127.")
//   );
// });

// app.use(cors());
// app.use(express.json());
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   // 👇 Skip GET webhook verification route
//   skip: (req) => req.originalUrl === "/api/v1/webhook" && req.method === "GET",
//   // 👇 Fallback for IP issues
//   keyGenerator: (req) => {
//     return req.ip || req.headers["x-forwarded-for"] || "unknown";
//   },
// });
// app.use(limiter);
// // app.use(
// //   rateLimit({
// //     windowMs: 15 * 60 * 1000, // 15 minutes
// //     max: 100,
// //   })
// // );
// // ✅ Rate limit excluding Meta GET webhook verify calls
// app.get("/", (req, res) =>
//   res.json({ message: "whatsapp helper working good" })
// );
// app.use("/api/v1/", whatsApproute);
// // Error handling
// app.use((error, req, res, next) => {
//   console.error("Unhandled error:", error);
//   res.status(500).json({
//     success: false,
//     message: "Internal server error",
//   });
// });

// // const PORT = process.env.PORT || 3000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 WhatsApp API running on port ${PORT}`);
// //   console.log(`📱 Health: http://localhost:${PORT}/api/v1/health`);
// // });

// let cachedServer = null;

// module.exports["oa_whatsapp_helper"] = functions.https.onRequest(
//   {
//     region: "asia-south1",
//     // cpu: 1,
//     // concurrency: 50,
//     // timeoutSeconds: 540,
//   },
//   (req, res) => {
//     if (!cachedServer) {
//       console.log("Initializing Express server...");
//       cachedServer = app;
//     }
//     return cachedServer(req, res);
//   }
// );
const express = require("express");
const functions = require("firebase-functions");
const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit"); // ✅ import helper
require("dotenv").config();
const cors = require("cors");
const whatsApproute = require("./src/router/routes");

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

app.get("/", (req, res) =>
  res.json({ message: "whatsapp helper working good" })
);
app.use("/api/v1/", whatsApproute);

module.exports["oa_whatsapp_helper"] = functions.https.onRequest(
  { region: "asia-south1" },
  (req, res) => {
    console.log("Initializing Express server...");
    return app(req, res);
  }
);
