import Joi from "joi";

export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(72).required(),
});

export const promoteAdminSchema = Joi.object({
  email: Joi.string().email().required(),
});
