const mongoose = require("mongoose");
const { getDatabaseName } = require("../utils");

const conversationSchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true }, // e.g., "2025-08"
    used: { type: Number, default: 0 },
    limit: { type: Number, default: 1000 },
  },
  { timestamps: true }
);
conversationSchema.index({ month: 1 }, { unique: true });

const myDB = mongoose.connection.useDb(getDatabaseName());

const CONVERSATION = myDB.model("Conversation", conversationSchema);

module.exports = { CONVERSATION };
