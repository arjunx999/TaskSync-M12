import express from "express";
import { createGroup, addMember, deleteGroup, removeMember } from "../controllers/groupController";
import { verifyToken } from "../middleware/auth";
import { upload } from "../middleware/multer";

const router = express.Router();

router.post("/create", upload.single("profilePic"), verifyToken, createGroup);
router.patch("/add-member/:id", verifyToken, addMember);
router.patch("/remove-member/:id", verifyToken, removeMember);
router.delete("/delete-group/:id", verifyToken, deleteGroup)

export default router;