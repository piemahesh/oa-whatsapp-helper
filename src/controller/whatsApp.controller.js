const { validationResult } = require("express-validator");
const { sendWhatsAppMessage, sendSyllabus } = require("../helper");

const greetingToUser = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { phoneNumber, countryCode, studentName, message } = req.body;
    const cleanPhone = countryCode + phoneNumber.replace(/\s+/g, "");
    // Send greeting via WhatsApp
    const response = await sendWhatsAppMessage(cleanPhone, studentName);

    res.status(200).json({
      success: true,
      message: "Greeting sent successfully",
      data: {
        studentName,
        phoneNumber: cleanPhone,
        messageId: response.messages[0].id,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending greeting:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send greeting",
      error: error.message,
    });
  }
};

const sendSyllabusToUser = async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { phoneNumber, countryCode, studentName, courseName, syllabusLink } =
      req.body;

    const cleanPhone = countryCode + phoneNumber.replace(/\s+/g, "");

    // Send syllabus via WhatsApp
    const response = await sendSyllabus(
      cleanPhone,
      studentName,
      courseName,
      syllabusLink
    );

    res.status(200).json({
      success: true,
      message: "Syllabus sent successfully",
      data: {
        studentName,
        courseName,
        phoneNumber: cleanPhone,
        syllabusLink,
        messageId: response.messages[0].id,
        sentAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error sending syllabus:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send syllabus",
      error: error.message,
    });
  }
};

module.exports = {
  greetingToUser,
  sendSyllabusToUser,
};
