import Company from "../models/companySchema.js";

// Create Company
export const createCompany = async (req, res, next) => {
  try {
    const { name, logo, website, about, location, companySize } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const existingCompany = await Company.findOne({
      postedBy: req.user._id,
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "You already have a company profile",
      });
    }

    const company = await Company.create({
      name,
      logo,
      website,
      about,
      location,
      companySize,
      postedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    next(error);
  }
};

// Get all companies created by logged-in recruite

export const getMyCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ postedBy: req.user._id });

    res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    next(error);
  }
};

// Get company of logged-in recruiter
export const getMyCompany = async (req, res, next) => {
  try {
    const company = await Company.findOne({
      postedBy: req.user._id,
    });

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};


// get single Company by ID

export const getCompanyById = async (req, res, next) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    next(error);
  }
};

//Update company (Only owner recruiter)

export const updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    if (company.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this company",
      });
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company,
    });
  } catch (error) {
    next(error);
  }
};

//Delete company

export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    if (company.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to Delete this company",
      });
    }

    await company.deleteOne();

    res.status(200).json({
      message: "Company deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
