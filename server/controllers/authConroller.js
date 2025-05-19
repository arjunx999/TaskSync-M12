import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
    // console.log(error.message)
  }
};

export const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "Username is already taken" });
    }
    const existingMail = await User.findOne({ email });
    if (existingMail) {
      return res.status(409).json({ msg: "Email ID is already taken" });
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    let profilePicPath = "";
    if (req.file) {
      profilePicPath = req.file.path.replace(/\\/g, "/");
    }

    const newUser = new User({
      username,
      name,
      email,
      password: passwordHash,
      profilePic: profilePicPath,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User successfully created",
      user: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
