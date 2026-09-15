import Application from "../models/applicationSchema.js";
import Job from "../models/jobSchema.js";
import User from "../models/userSchema.js";
import { generateContent } from "../utils/geminiClient.js";

// Helper for parsing Gemini JSON responses
const parseAIJson = (raw) => {
  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
};

// Generate AI resume match for an application
const analyzeResumeMatch = async (resumeText, jobDescription) => {
  const prompt = `
You are an AI recruitment assistant.

Analyze how well the candidate's resume matches the given job description.

RESUME:

${resumeText}

JOB DESCRIPTION:

${jobDescription}

Evaluate the candidate based on:

- Required skills
- Technical experience
- Relevant qualifications
- Overall suitability for the role

Return the result ONLY in this JSON format:

{
  "score": 85,
  "feedback": "The candidate is a strong match because..."
}

Rules:

- score must be a number between 0 and 100.
- feedback should briefly explain the main strengths and missing skills.
- Do not include markdown.
- Do not include any extra text outside the JSON.
`;

  const result = await generateContent(prompt);

  return parseAIJson(result);
};

export const applyForJobs = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const candidateId = req.user._id;

    // Check if user is a candidate
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        success: false,
        message: "Only candidates can apply for jobs",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    
    if (job.deadline) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const deadline = new Date(job.deadline);
      deadline.setHours(0, 0, 0, 0);

      if (today > deadline) {
        return res.status(400).json({
          success: false,
          message: "This job application deadline has passed.",
        });
      }
    }

    // Resume URL selected by the candidate
    const { resume, resumeText, coverLetter } = req.body;

    if (!resume) {
      return res.status(400).json({
        success: false,
        message: "Please select or upload a resume before applying.",
      });
    }

    // Check if user has already applied
    const applicationExists = await Application.findOne({
      jobId,
      candidateId,
    });

    if (applicationExists) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Get candidate profile resume only as a fallback
    const candidate = await User.findById(candidateId).select("resume");

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    
  
    const selectedResumeText = resumeText || candidate.resume?.extractedText;

    if (!selectedResumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to read the selected resume. Please upload the resume again.",
      });
    }

    // Run AI resume analysis
    let aiResult;

    try {
      aiResult = await analyzeResumeMatch(selectedResumeText, job.description);
    } catch (aiError) {
      console.error("AI resume analysis failed:", aiError);

      return res.status(500).json({
        success: false,
        message: "Unable to analyze your resume right now. Please try again.",
      });
    }

    // Validate AI score
    const aiScore = Number(aiResult?.score);

    if (Number.isNaN(aiScore) || aiScore < 0 || aiScore > 100) {
      return res.status(500).json({
        success: false,
        message: "AI returned an invalid resume match score.",
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      candidateId,
      resume,
      coverLetter: coverLetter || "",
      AIScore: aiScore,
      AIFeedback: aiResult?.feedback || "",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// Get my applications
export const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({
      candidateId: req.user._id,
    })
      .populate({
        path: "jobId",
        populate: {
          path: "company",
          select: "name logo website",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Get applicants for a job
export const getJobApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Check if job exists
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check if logged-in recruiter owns the job
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view these applicants",
      });
    }

    const applications = await Application.find({
      jobId,
    })
      .populate("candidateId", "name email avatar skills bio")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check job ownership
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this application",
      });
    }

    application.status = status;

    await application.save();

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};


export const deleteApplication = async (req, res, next) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Only rejected applications can be deleted
    if (application.status !== "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Only rejected applications can be deleted",
      });
    }

    const job = await Job.findById(application.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Only the job owner or admin can delete the application
    if (
      job.postedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this application",
      });
    }

    await Application.findByIdAndDelete(applicationId);

    res.status(200).json({
      success: true,
      message: "Rejected application deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
