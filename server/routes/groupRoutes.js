import express from "express";
import { createGroup, addMember, deleteGroup, removeMember } from "../controllers/groupController.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/create", upload.single("profilePic"), verifyToken, createGroup);
router.patch("/add-member/:id", verifyToken, addMember);
router.patch("/remove-member/:id", verifyToken, removeMember);
router.delete("/delete-group/:id", verifyToken, deleteGroup)

export default router;