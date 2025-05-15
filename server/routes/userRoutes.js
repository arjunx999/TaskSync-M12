import express from "express";
import {
  getAllUsers,
  getUser,
  getUserConversations,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);

router.get("/:id", verifyToken, getUser);

router.get("/getConversations/:id", verifyToken, getUserConversations);

export default router;
