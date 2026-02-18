import Joi from "joi";

export const logInUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});
