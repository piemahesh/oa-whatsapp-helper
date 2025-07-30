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

// web hooks

// ✅ Webhook Verification (GET)
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Webhook verification failed.");
    res.sendStatus(403);
  }
});

// ✅ Message Handler (POST)
router.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;

    if (messages && messages.length > 0) {
      const message = messages[0];
      const phoneNumber = message.from;
      const text = message.text?.body;
      const timestamp = message.timestamp;

      console.log(`📩 Message received from ${phoneNumber}`);
      console.log(`💬 Message: ${text}`);
      console.log(`⏱️ Time: ${new Date(timestamp * 1000).toLocaleString()}`);

      // TODO: Save to DB or respond using WhatsApp API
    }
  }

  // Always return 200 to acknowledge receipt
  res.sendStatus(200);
});

module.exports = router;
