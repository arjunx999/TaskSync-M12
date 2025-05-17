import { GroupMessage } from "../models/group_message.js";

export const sendGroupMessage = async (req, res) => {
  try {
    const sender = req.user.id;
    const { groupId, content } = req.body;
    const file = req.file;

    if (!groupId) {
      return res.status(400).json({ message: "Group ID is required" });
    }

    const newGroupMessage = new GroupMessage({
      group: groupId,
      sender,
      content: content || "",
      attachment: file ? file.path : null,
    });

    const saved = await newGroupMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const messages = await GroupMessage.find({ group: groupId })
      .sort({ createdAt: 1 })
      .populate("sender", "username name profilePic");

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
