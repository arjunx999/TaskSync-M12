import { Task } from "../models/task.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const creator = req.user.id;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ message: "Incomplete details" });
    }

    const newTask = new Task({
      title,
      description,
      dueDate,
      createdBy: creator,
    });

    const saved = await newTask.save();
    return res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { taskId, currentStatus } = req.body;
    if (!currentStatus || !taskId) {
      return res.status(400).json({ message: "Incomplete details" });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { status: currentStatus },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task status updated", task });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const tasks = await Task.find({ createdBy: userId });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.remove();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
