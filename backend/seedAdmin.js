// backend/seedAdmin.js
// Run once with: node seedAdmin.js

import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/userSchema.js";

dotenv.config();

const ADMIN_NAME = process.env.ADMIN_NAME;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const seedAdmin = async () => {
  try {
    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      console.error("Missing ADMIN_NAME, ADMIN_EMAIL, or ADMIN_PASSWORD in .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log("Admin already exists with this email. Aborting.");
      process.exit(0);
    }

    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // hashed automatically by pre-save hook
      role: "admin",
    });

    console.log("Admin created successfully:");
    console.log({ id: admin._id, email: admin.email, role: admin.role });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error);
    process.exit(1);
  }
};

seedAdmin();