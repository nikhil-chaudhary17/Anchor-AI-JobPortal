import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: String,
      required: true,
    },

    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Rejected", "Hired"],
      default: "Applied",
    },

    AIScore: {
      type: Number,
      default: null,
      min: 0,
      max: 100,
    },

    AIFeedback: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const Application = mongoose.model("Application", applicationSchema);

export default Application;
