import express from "express";
import { register, login, logout } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validateRequest.js";
import { registerSchema , loginSchema } from '../validators/authValidators.js'

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", protect, logout);

export default router;
