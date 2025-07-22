const axios = require("axios");
const { WHATSAPP_CONFIG } = require("../utils");
// WhatsApp API helper
const sendWhatsAppMessage = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_CONFIG.baseURL}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        to: phoneNumber,
        type: "text",
        text: {
          body: message,
          preview_url: true,
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

const sendSyllabus = async (phoneNumber, message, courseName, syllabusLink) => {
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
          caption: message,
          filename: `${courseName}.pdf`,
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
};
