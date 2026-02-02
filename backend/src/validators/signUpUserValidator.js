import Joi from "joi";

export const signUpUserValidator = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(20).required(),
});
