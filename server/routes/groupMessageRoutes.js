import express from "express";
import {
  sendGroupMessage,
  getGroupMessages,
} from "../controllers/grouptMessageController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post(
  "/send",
  verifyToken,
  upload.single("messageFile"),
  sendGroupMessage
);

router.get("/getMessages/:id", verifyToken, getGroupMessages);

export default router;
