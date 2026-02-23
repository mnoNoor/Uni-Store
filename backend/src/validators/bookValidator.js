import Joi from "joi";

export const validateBookSchema = Joi.object({
  title: Joi.string().trim().min(3).max(30).required(),
  description: Joi.string().min(10).required(),
  section: Joi.string().valid("male", "female", "both").required(),
  price: Joi.number().min(0).required(),
  whatsapp: Joi.string().allow("", null),
  telegram: Joi.string().allow("", null),
});
