import mongoose from "mongoose";

const groupMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  attachment: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export const GroupMessage = mongoose.model("GroupMessage", groupMessageSchema);
