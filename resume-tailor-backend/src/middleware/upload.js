import multer from "multer";
import { config } from "../config/env.js";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: config.upload.maxFileSizeMb * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype) || /\.(pdf|docx|txt)$/i.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Upload a .pdf, .docx, or .txt file."));
    }
  },
});
