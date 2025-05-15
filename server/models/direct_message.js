import mongoose from "mongoose";

const directMessageSchema = mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  attachment: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const DirectMessage = mongoose.model("DirectMessage", directMessageSchema);
