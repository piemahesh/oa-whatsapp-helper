const axios = require("axios");
const { WHATSAPP_CONFIG } = require("../utils");
const toCamelCase = require("./formatCourseName");
const { ENQUIRY, CONVERSATION } = require("../models");
const dayjs = require("dayjs");

async function handleIncomingMessageWebhook({ phoneNumber, timestamp }) {
  const enquiry = await ENQUIRY.findOne({ phoneNumber: `+${phoneNumber}` });

  console.log("phonenumber", phoneNumber);

  if (enquiry) {
    console.log("is enquiry");

    const timestampInMs = Number(timestamp) * 1000;
    const now = new Date(timestampInMs);

    const previousInitiatedAt = enquiry.initiatedAt || new Date(0);
    const isNewUserInitiatedConversation =
      now - previousInitiatedAt > 24 * 60 * 60 * 1000;

    if (isNewUserInitiatedConversation) {
      console.log("✅ New user-initiated conversation started");

      enquiry.initiatedAt = now;
      enquiry.templateSent = false;

      const month = dayjs().format("YYYY-MM");

      await CONVERSATION.updateOne(
        { month },
        [
          {
            $set: {
              used: { $add: [{ $ifNull: ["$used", 0] }, 1] },
              limit: { $ifNull: ["$limit", 1000] },
            },
          },
        ],
        { upsert: true }
      );
    } else {
      console.log("⏱️ Within 24h window — no counter update");
    }

    await enquiry.save();
  } else {
    console.log("❌ No enquiry found for this phone number");
  }
}

const sendWhatsAppMessage = async (phoneNumber, studentName) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_CONFIG.baseURL}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "text",
        text: {
          preview_url: true,
          body: `Hi ${studentName}! 👋

Welcome to *Ocean Academy* — where your learning journey begins! 💻🖱  
We’re thrilled to have you with us and excited to be part of your growth. 🚀

You’ve taken the first step toward a brighter future, and we’re here to help you reach your goals with confidence. 💯

Feel free to ask us about:
✅ Courses  
✅ Batch timings  
✅ Career support  
✅ Anything else you need!

Let’s make your future unstoppable! 💪✨  
🌐 Visit our website : https://oceanacademy.co.in/`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `WhatsApp API error: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};

const sendSyllabus = async (
  phoneNumber,
  studentName,
  courseName,
  syllabusLink
) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_CONFIG.baseURL}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "document",
        document: {
          link: syllabusLink,
          caption: `Hi *${studentName}* 👋,
Here's your *${courseName}* Syllabus PDF. 📄

If you need any further assistance or have any questions, feel free to reach out. We're here to help!

Best regards,
*Ocean Academy*
          `,
          filename: `${toCamelCase(courseName)}.pdf`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `WhatsApp API error: ${
        error.response?.data?.error?.message || error.message
      }`
    );
  }
};
module.exports = {
  sendWhatsAppMessage,
  sendSyllabus,
  handleIncomingMessageWebhook,
};
