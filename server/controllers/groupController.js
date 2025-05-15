import { Group } from "../models/group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const profilePicPath = "";
    if (req.file) {
      profilePicPath = req.file.path;
    }
    const newGroup = await Group.create({
      name,
      description,
      members,
      createdBy: req.user._id,
      members: [req.user._id],
      profilePic: profilePicPath,
    });
    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ error: "Group creation failed" });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(
      id,
      { $addToSet: { members: userId } },
      { new: true }
    );
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: "Adding member failed" });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const group = await Group.findByIdAndUpdate(
      id,
      { $pull: { members: userId } },
      { new: true }
    );
    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: "Removing member failed" });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedGroup = await Group.findByIdAndDelete(id);

    if (!deletedGroup) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully", deletedGroup });
  } catch (err) {
    console.error("Delete Group Error:", err);
    res.status(500).json({ error: "Failed to delete group" });
  }
};
