import Joi from "joi";

export const updateBookSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string().min(10).max(2000),
  section: Joi.string().valid("male", "female", "both"),
  price: Joi.number().min(0),
  publisher: Joi.string().trim().min(1).max(80).allow("", null),
  whatsapp: Joi.string().allow("", null),
  telegram: Joi.string().allow("", null),
}).min(1);
