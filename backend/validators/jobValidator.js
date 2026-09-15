import Joi from "joi";

export const createJobSchema = Joi.object({
  title: Joi.string().trim().min(3).required().messages({
    "string.empty": "Job title is required",
    "string.min": "Job title must be at least 3 characters",
  }),

  description: Joi.string().trim().min(10).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description must be at least 10 characters",
  }),

  company: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Valid company ID is required",
      "string.empty": "Company is required",
    }),

  location: Joi.string().trim().required().messages({
    "string.empty": "Location is required",
  }),

  salaryMin: Joi.number().positive().required().messages({
    "number.base": "Minimum salary must be a number",
    "number.positive": "Minimum salary must be greater than 0",
  }),

  salaryMax: Joi.number().positive().required().messages({
    "number.base": "Maximum salary must be a number",
    "number.positive": "Maximum salary must be greater than 0",
  }),

  jobType: Joi.string()
    .valid(
      "full-time",
      "part-time",
      "internship",
      "contract",
      "freelance"
    )
    .optional(),

  experience: Joi.string().required().messages({
    "string.empty": "Experience is required",
  }),

  skillsRequired: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  deadline: Joi.date().greater("now").required().messages({
    "date.base": "Valid deadline is required",
    "date.greater": "Deadline must be a future date",
  }),
});