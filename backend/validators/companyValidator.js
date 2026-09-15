import Joi from "joi";

export const createCompanySchema = Joi.object({
  name: Joi.string().trim().min(2).required().messages({
    "string.empty": "Company name is required",
  }),

  logo: Joi.string().uri().optional().allow(""),

  website: Joi.string().uri().optional().allow("").messages({
    "string.uri": "Website must be a valid URL",
  }),

  about: Joi.string().trim().min(10).required().messages({
    "string.empty": "Company description is required",
    "string.min": "Company description must be at least 10 characters",
  }),

  location: Joi.string().trim().required().messages({
    "string.empty": "Company location is required",
  }),

  companySize: Joi.string()
    .valid(
      "1–10 employees",
      "11–50 employees",
      "51–200 employees",
      "200+ employees",
    )
    .required()
    .messages({
      "any.only": "Please select a valid company size",
    }),
});
