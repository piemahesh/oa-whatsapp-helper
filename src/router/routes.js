const express = require("express");
const { greetingValidator, sendSyllabusValidator } = require("../validator");
const { greetingToUser, sendSyllabusToUser } = require("../controller");

const router = express();

// 1. Send Greeting Function
router.post("/send-greeting", greetingValidator, greetingToUser);

// 2. Send Syllabus Link Function
router.post("/send-syllabus", sendSyllabusValidator, sendSyllabusToUser);

// Health check
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "WhatsApp Syllabus Sender",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
