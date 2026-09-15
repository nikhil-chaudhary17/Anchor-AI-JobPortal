import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("candidate", "recruiter").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});