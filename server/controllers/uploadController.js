import path from "path";

//upload pfp
export const uploadProfilePicture = (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "No file uploaded or invalid file type." });
  }
  res.status(200).json({
    message: "Profile picture uploaded successfully.",
    path: req.file.path.replace(/\\/g, "/"),
  });
};

// upload attachment
export const uploadMessageFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  res.status(200).json({
    message: "Message file uploaded successfully.",
    path: req.file.path.replace(/\\/g, "/"),
  });
};
