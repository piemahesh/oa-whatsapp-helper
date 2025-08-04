// const { validationResult } = require("express-validator");
// const { sendWhatsAppMessage, sendSyllabus } = require("../helper");

// const greetingToUser = async (req, res) => {
//   try {
//     // Validation check
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     const { phoneNumber, countryCode, studentName, message } = req.body;
//     const cleanPhone = countryCode + phoneNumber.replace(/\s+/g, "");
//     // Send greeting via WhatsApp
//     const response = await sendWhatsAppMessage(cleanPhone, studentName);

//     res.status(200).json({
//       success: true,
//       message: "Greeting sent successfully",
//       data: {
//         studentName,
//         phoneNumber: cleanPhone,
//         messageId: response.messages[0].id,
//         sentAt: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error("Error sending greeting:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send greeting",
//       error: error.message,
//     });
//   }
// };

// const sendSyllabusToUser = async (req, res) => {
//   try {
//     // Validation check
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success: false,
//         errors: errors.array(),
//       });
//     }

//     const { phoneNumber, countryCode, studentName, courseName, syllabusLink } =
//       req.body;

//     const cleanPhone = countryCode + phoneNumber.replace(/\s+/g, "");

//     // Send syllabus via WhatsApp
//     const response = await sendSyllabus(
//       cleanPhone,
//       studentName,
//       courseName,
//       syllabusLink
//     );

//     res.status(200).json({
//       success: true,
//       message: "Syllabus sent successfully",
//       data: {
//         studentName,
//         courseName,
//         phoneNumber: cleanPhone,
//         syllabusLink,
//         messageId: response.messages[0].id,
//         sentAt: new Date().toISOString(),
//       },
//     });
//   } catch (error) {
//     console.error("Error sending syllabus:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to send syllabus",
//       error: error.message,
//     });
//   }
// };

const { validationResult } = require("express-validator");
const { sendWhatsAppMessage, sendSyllabus } = require("../helper");
const dayjs = require("dayjs");
const { ENQUIRY, CONVERSATION } = require("../models");

const handleSyllabusAndGreeting = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { phoneNumber, countryCode, studentName, courseName, syllabusLink } =
      req.body;

    const cleanPhone = countryCode + phoneNumber.replace(/\s+/g, "");
    const month = dayjs().format("YYYY-MM");

    let enquiry = await ENQUIRY.findOne({ phoneNumber: cleanPhone });
    let isNewEnquiry = false;
    let is24hrConversation = false;
    let greetingSent = false;
    let syllabusSent = false;

    if (!enquiry) {
      // New enquiry — store in DB
      enquiry = await ENQUIRY.create({
        phoneNumber: cleanPhone,
        name: studentName,
        templateSent: false,
        initiatedAt: null,
      });
      isNewEnquiry = true;
    } else {
      // Update name if empty
      if (!enquiry.name) {
        enquiry.name = studentName;
      }
      await enquiry.save();
    }

    // Check 24hr conversation window
    if (enquiry.initiatedAt) {
      const hoursSince = dayjs().diff(dayjs(enquiry.initiatedAt), "hour");
      is24hrConversation = hoursSince <= 24;
      console.log(is24hrConversation);
    }

    // If not within 24hr, return early
    if (!is24hrConversation) {
      return res.status(404).json({
        success: false,
        isNewEnquiry,
        is24hrConversation: false,
        message: ` Hi ${studentName} 🖐🏻, please first initiate WhatsApp conversation.`,
      });
    }

    // Ensure monthly record
    // await CONVERSATION.findOneAndUpdate(
    //   { month },
    //   { $setOnInsert: { used: 0, limit: 1000 } },
    //   { upsert: true }
    // );

    // Send greeting (only once per 24hr)
    if (!enquiry.templateSent) {
      await sendWhatsAppMessage(cleanPhone, studentName);
      enquiry.templateSent = true;
      greetingSent = true;
      // await CONVERSATION.updateOne({ month }, { $inc: { used: 1 } });
    }

    // Always send syllabus
    await sendSyllabus(cleanPhone, studentName, courseName, syllabusLink);
    syllabusSent = true;
    // await CONVERSATION.updateOne({ month }, { $inc: { used: 1 } });

    await enquiry.save();

    // ✅ Final response
    res.status(200).json({
      success: true,
      isNewEnquiry,
      is24hrConversation: true,
      greetingSent,
      syllabusSent,
      phoneNumber: cleanPhone,
      sentAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in combined send:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send greeting and syllabus",
      error: error.message,
    });
  }
};

module.exports = {
  handleSyllabusAndGreeting,
  // greetingToUser,
  // sendSyllabusToUser,
};
