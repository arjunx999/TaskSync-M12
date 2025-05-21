import multer from "multer";
import path from "path";

// Storage Instructions
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "profilePic") {
      cb(null, "uploads/profilePictures");
    } else if (file.fieldname === "attachment") {
      cb(null, "uploads/messages");
    } else {
      cb(null, "uploads/others");
    }
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// File Filters
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "profilePic") {
    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "attachment") {
    cb(null, true);
  } else {
    cb(new Error("Unsupported field."), false);
  }
};

// Multer Instance
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10mb limit
  },
});
