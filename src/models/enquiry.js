const mongoose = require("mongoose");
const { getDatabaseName } = require("../utils");

const enquirySchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      default: null,
    },
    initiatedAt: {
      type: Date,
      default: null, // updated via webhook when user messages
    },
    templateSent: {
      type: Boolean,
      default: false, // reset to false every new 24hr window
    },
    lastGreetedAt: {
      type: Date,
      default: null, // optional: when greeting was last sent
    },
  },
  { timestamps: true }
);
const myDB = mongoose.connection.useDb(getDatabaseName());

const ENQUIRY = myDB.model("Enquiry", enquirySchema);

module.exports = { ENQUIRY };
