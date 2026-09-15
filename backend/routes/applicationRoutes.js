import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import {
  applyForJobs,
  deleteApplication,
  getJobApplicants,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post(
  "/:id/apply",
  protect,
  authorizeRoles("candidate", "admin"),
  applyForJobs,
);

router.get(
  "/my-applications",
  protect,
  authorizeRoles("candidate"),
  getMyApplications,
);

router.get(
  "/job/:id/applicants",
  protect,
  authorizeRoles("recruiter", "admin"),
  getJobApplicants,
);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("recruiter", "admin"),
  updateApplicationStatus,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("recruiter", "admin"),
  deleteApplication
);

export default router;
