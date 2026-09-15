import express from "express";
import {
  createJob,
  deleteJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  updateJob,
} from "../controllers/jobController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import {createJobSchema} from '../validators/jobValidator.js'

const router = express.Router();

router.post(
  "/create",
  protect,
  authorizeRoles("recruiter", "admin"),
  validate(createJobSchema),
  createJob,
);

router.get("/", getAllJobs);


router.get(
  "/my-jobs",
  protect,
  authorizeRoles("recruiter"),
  getMyJobs
);

router.get("/:id", getJobById);

router.put("/:id", protect,authorizeRoles("recruiter", "admin"), updateJob);

router.delete("/:id", protect,authorizeRoles("recruiter", "admin"), deleteJob);

export default router;
