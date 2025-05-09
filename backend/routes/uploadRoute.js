import express from "express";
import multer from "multer";
import path from "path";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/", protect, upload.single("profilePic"), (req, res) => {
  res.status(200).json({ imageUrl: `http://localhost:5000/uploads/${req.file.filename}` });
});

export default router;
