import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salaryMin: {
      type: Number,
      required: true,
    },

    salaryMax: {
      type: Number,
      required: true,
    },

    jobType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "internship",
        "contract",
        "freelance",
      ],
      default: "full-time",
    },

    experience: {
      type: String,
      required: true,
    },

    skillsRequired: {
      type: [String],
      default: [],
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);