import Joi from "joi";

export const updateBookSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().min(10),
  section: Joi.string().valid("male", "female", "both"),
  price: Joi.number().min(0),
  whatsapp: Joi.number(),
  telegram: Joi.string(),
}).min(1);
