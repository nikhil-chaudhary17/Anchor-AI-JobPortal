import User from "../models/userSchema.js";
import Job from "../models/jobSchema.js";
import Application from "../models/applicationSchema.js";
import Company from "../models/companySchema.js"

export const getAllUsers = async(req , res , next) => {
    try {
        const { role , status } = req.query;
        const filter = {};
        if(role) filter.role = role;
        if(status) filter.status = status;

        const users = await User.find(filter).select("-password");
        res.json({ success: true, count: users.length, users });


    } catch (error) {
        next(error);
    }
}


export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};


export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Cannot change status of an admin account",
      });
    }

    user.status = status;
    await user.save();

    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, status: user.status },
    });
  } catch (error) {
    next(error);
  }
}



export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ success: false, message: "Cannot delete an admin account" });
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};



export const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalCandidates, totalRecruiters, totalJobs, totalApplications, totalCompanies] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ role: "candidate" }),
        User.countDocuments({ role: "recruiter" }),
        Job.countDocuments(),
        Application.countDocuments(),
        Company.countDocuments(),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalApplications,
        totalCompanies,
      },
    });
  } catch (error) {
    next(error);
  }
};