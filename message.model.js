const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessagesSchema = new Schema(
  {
    user: { type: String },
    text: { type: String, required: true, trim: true },
    addedAt: { type: Date, default: Date.now, select: false }
  },
  {
    collection: "messages"
  }
);

module.exports = mongoose.model("MessagesModel", MessagesSchema);
