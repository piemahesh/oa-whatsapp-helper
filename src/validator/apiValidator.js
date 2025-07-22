const { body } = require("express-validator");
// Phone number validation
const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{10,14}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
};

const greetingValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .custom(validatePhoneNumber)
    .withMessage("Invalid phone number format"),
  body("studentName")
    .notEmpty()
    .withMessage("Student name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("message")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Message too long (max 1000 characters)"),
];

const sendSyllabusValidator = [
  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .custom(validatePhoneNumber)
    .withMessage("Invalid phone number format"),
  body("studentName")
    .notEmpty()
    .withMessage("Student name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be 2-50 characters"),
  body("courseName").notEmpty().withMessage("Course name is required"),
  body("syllabusLink")
    .notEmpty()
    .withMessage("Syllabus link is required")
    .isURL()
    .withMessage("Invalid URL format"),
];

module.exports = {
  validatePhoneNumber,
  greetingValidator,
  sendSyllabusValidator,
};
