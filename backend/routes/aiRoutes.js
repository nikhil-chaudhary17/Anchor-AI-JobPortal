import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import { generateJobDescriptionSchema } from "../validators/aiValidator.js";
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateJobDescription,
  matchResumeWithJob,
  recommendJobs,
} from "../controllers/aiController.js";

const router = express.Router();

router.post(
  "/generate-job-description",
  protect,
  authorizeRoles("recruiter", "admin"),
  validate(generateJobDescriptionSchema),
  generateJobDescription,
);

router.post(
  "/resume-match",
  protect,
  authorizeRoles("candidate"),
  matchResumeWithJob,
);

router.post(
  "/job-recommendations",
  protect,
  authorizeRoles("candidate"),
  recommendJobs,
);

router.post(
  "/cover-letter",
  protect,
  authorizeRoles("candidate"),
  generateCoverLetter
);

router.post(
  "/interview-prep",
  protect,
  authorizeRoles("candidate"),
  generateInterviewPrep
);

export default router;
