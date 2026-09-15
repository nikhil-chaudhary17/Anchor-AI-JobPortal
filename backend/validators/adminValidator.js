import Joi from "joi";

export const updateStatusSchema = Joi.object({
  status: Joi.string().valid("active", "suspended", "pending").required().messages({
    "any.only": "Status must be one of: active, suspended, pending",
    "string.empty": "Status is required",
  }),
});