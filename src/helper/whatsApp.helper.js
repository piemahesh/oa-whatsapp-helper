const axios = require("axios");
const { WHATSAPP_CONFIG } = require("../utils");
const toCamelCase = require("./formatCourseName");
// WhatsApp API helper
const sendWhatsAppMessage = async (phoneNumber, studentName) => {
  try {
    const response = await axios.post(
      `${WHATSAPP_CONFIG.baseURL}/${WHATSAPP_CONFIG.phoneNumberId}/messages`,
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "template",
        template: {
          name: "greeting_2",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "image",
                  image: {
                    link: "https://firebasestorage.googleapis.com/v0/b/oceanlivereact.appspot.com/o/ocean_assets%2FoceanAcademyPoster.png?alt=media&token=0bb6449b-de44-4240-bdce-116ccb36afad", // Use the full approved URL
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: studentName,
                  parameter_name: "name",
                },
              ],
            },
          ],
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
        to: phoneNumber,
        type: "template",
        template: {
          name: "syllabus_template",
          language: {
            code: "en",
          },
          components: [
            {
              type: "header",
              parameters: [
                {
                  type: "document",
                  document: {
                    link: syllabusLink,
                    filename: `${toCamelCase(courseName)}.pdf`,
                  },
                },
              ],
            },
            {
              type: "body",
              parameters: [
                { type: "text", text: studentName, parameter_name: "name" },
                {
                  type: "text",
                  text: courseName,
                  parameter_name: "course_name",
                },
              ],
            },
          ],
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
