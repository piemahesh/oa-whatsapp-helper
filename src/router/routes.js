const express = require("express");
const { greetingValidator, sendSyllabusValidator } = require("../validator");
const {
  handleSyllabusAndGreeting,
  verifyWebhookToken,
  webhookHandler,
  healthChecker,
  // sendSyllabusToUser,
} = require("../controller");

const router = express.Router();

// Send Syllabus Link Function
router.post("/send-syllabus", sendSyllabusValidator, handleSyllabusAndGreeting);

// Health check
router.get("/health", healthChecker);

// ✅ Webhook Verification (GET)
router.get("/webhook", verifyWebhookToken);

// ✅ Message Handler (POST)
router.post("/webhook", webhookHandler);

module.exports = router;
