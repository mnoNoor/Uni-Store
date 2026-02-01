import Joi from "joi";

export const validateUserSchema = Joi.object({
  username: Joi.string().min(3).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});
