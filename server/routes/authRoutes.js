import express from "express";
import { register, login } from "../controllers/authConroller.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/signup", upload.single("profilePic"), register); 

router.post("/login", login);

export default router;