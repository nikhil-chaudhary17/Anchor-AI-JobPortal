import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from './routes/adminRoutes.js';
import aiRoutes from "./routes/aiRoutes.js";
import resumeRoutes from './routes/resumeRoutes.js';
import { errorHandler } from "./middlewares/errorHandler.js";
import { mongoSanitize } from "./middlewares/sanitize.js";

connectDB();

const app = express();

//middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(mongoSanitize);

// Global rate limiter — applies to all routes

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use(globalLimiter);


const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,


    skipSuccessfulRequests: true,

    message: {
        success: false,
        message: "Too many failed login attempts. Please try again after 15 minutes.",
    },
});


// Stricter limiter just for auth routes (login/register brute-force protection)


const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { success: false, message: "Too many AI requests, slow down." },
});


const resumeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // uploads are heavier (Cloudinary + parsing) than typical requests
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many resume uploads, slow down." },
});


//routes

app.get("/health", (req, res) => {
  res.json({ status: "Server is running" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin" , adminRoutes);
app.use("/api/ai",aiLimiter, aiRoutes);
app.use("/api/resume", resumeLimiter, resumeRoutes);


app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
