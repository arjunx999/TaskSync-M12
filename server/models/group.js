import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  name: {
    type: String,
    min: 2,
    max: 20,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    max: 50,
    default: "Welcome to the group",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  profilePic: {
    type: String,
    default: "",
  },
});

export const Group = mongoose.model("Group", groupSchema);
