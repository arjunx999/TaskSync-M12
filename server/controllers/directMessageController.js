import { DirectMessage } from "../models/direct_message.js";

// Send a message
export const sendDirectMessage = async (req, res) => {
  try {
    const { content, receiverId, attachment, senderId } = req.body;
    // const sender = req.user.id;
    // const file = req.file;

    const newMessage = new DirectMessage({
      sender: senderId,
      receiver: receiverId,
      content: content || "",
      attachment: attachment ? attachment.path : null,
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all messages between two users
export const getDirectMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { otherUserId } = req.params;

    const messages = await DirectMessage.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
