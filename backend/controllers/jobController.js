import Job from "../models/jobSchema.js";
import Company from "../models/companySchema.js";

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      jobType,
      experience,
      skillsRequired,
      deadline,
    } = req.body;

    // Check if company exists and belongs to recruiter
    const companyExists = await Company.findOne({
      _id: company,
      postedBy: req.user._id,
    });

    if (!companyExists) {
      return res.status(404).json({
        success: false,
        message: "Company not found or not authorized",
      });
    }

    const newJob = await Job.create({
      title,
      description,
      company,
      location,
      salaryMin,
      salaryMax,
      jobType,
      experience,
      skillsRequired,
      deadline,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      newJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const jobs = await Job.find({
      deadline: { $gte: today },
    })
      .populate("postedBy", "name email")
      .populate("company", "name logo website")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user._id,
    })
      .populate("postedBy", "name email")
      .populate("company", "name logo website")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};


export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email")
      .populate("company", "name logo website")
      .lean();

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
    });
  } catch (error) {
    next(error);
  }
};

export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this job",
        success: false,
      });
    }

    if (req.body.company) {
      const companyExists = await Company.findById(req.body.company);
      if (!companyExists) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        message: "job not found",
        success: false,
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this job",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
