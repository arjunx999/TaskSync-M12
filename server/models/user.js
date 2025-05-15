import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    min: 5,
    max: 20,
    unique: true,
  },
  name: {
    type: String,
    require: true,
    min: 2,
    max: 50,
  },
  email: {
    type: String,
    require: true,
    max: 50,
    unique: true,
  },
  bio: {
    type: String,
    max: 50,
    default: "Hey there! I am using TaskSync",
  },
  password: {
    type: String,
    require: true,
    min: 5,
    max: 15,
  },
  profilePic: {
    type: String,
    default: "uploads/profilePictures/default_avatar.jpg",
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

export const User = mongoose.model("User", userSchema);
