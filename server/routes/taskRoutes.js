import express from "express";
import {
  createTask,
  updateTask,
  getTaskById,
  getUserTasks,
  deleteTask,
} from "../controllers/taskController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);

router.patch("/update", verifyToken, updateTask);

router.get("/:id", verifyToken, getTaskById);

router.get("/user/:userId", verifyToken, getUserTasks);

router.delete("/:taskId", verifyToken, deleteTask);

export default router;
