import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 20,
    required: true,
  },
  description: {
    type: String,
    max: 100,
  },
  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do",
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
  dueDate: {
    type: Date,
    required: true,
  },
});

export const Task = mongoose.model("Task", taskSchema);
