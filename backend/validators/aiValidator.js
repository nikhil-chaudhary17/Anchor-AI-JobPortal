import Joi from "joi";

export const generateJobDescriptionSchema = Joi.object({
  title: Joi.string().trim().min(2).required(),
  keyPoints: Joi.string().trim().min(5).required(),
  jobType: Joi.string().valid("full-time", "part-time", "remote", "internship").optional(),
  location: Joi.string().trim().optional(),
});