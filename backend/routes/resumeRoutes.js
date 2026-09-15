import express from "express";
import upload from "../middlewares/upload.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { uploadApplicationResume, uploadResumeHandler } from "../controllers/resumeController.js";

const router = express.Router();

router.post(
  "/upload",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadResumeHandler,
);

router.post(
  "/upload-resume",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  uploadApplicationResume
);


export default router;