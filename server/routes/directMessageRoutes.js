import express from "express";
import {
  sendDirectMessage,
  getDirectMessages,
} from "../controllers/directMessageController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/send",
  verifyToken,
  upload.single("messageFile"),
  sendDirectMessage
);

router.get("/getMessages/:id", verifyToken, getDirectMessages);

export default router;
