const { handleIncomingMessageWebhook } = require("../helper");
const { CONVERSATION } = require("../models");

const verifyWebhookToken = async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log(mode, token, challenge);
  console.log("-------------------");

  if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
    console.log("✅ Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    console.warn("❌ Webhook verification failed.");
    res.sendStatus(403);
  }
};

const webhookHandler = async (req, res) => {
  const body = req.body;

  if (body.object === "whatsapp_business_account") {
    const messages = body.entry?.[0]?.changes?.[0]?.value?.messages;
    console.log(JSON.stringify(body));
    if (messages && messages.length > 0) {
      const message = messages[0];
      const phoneNumber = message.from;
      const text = message.text?.body;
      const timestamp = message.timestamp;
      //   console.log(`📩 Message received from ${phoneNumber}`);
      //   console.log(`💬 Message: ${text}`);
      //   console.log(`⏱️ Time: ${new Date(timestamp * 1000).toLocaleString()}`);
      await handleIncomingMessageWebhook({ phoneNumber, timestamp });
    }
  }
  // Always return 200 to acknowledge receipt
  res.sendStatus(200);
};

const healthChecker = async (_, res) => {
  const data = await CONVERSATION.find();
  res.json({
    status: "healthy",
    data,
    service: "WhatsApp Syllabus Sender",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  verifyWebhookToken,
  webhookHandler,
  healthChecker,
};
