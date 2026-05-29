import Joi from "joi";

export const updateProfileSchema = Joi.object({
  username: Joi.string().trim().min(3).max(30),
  email: Joi.string().email(),
  currentPassword: Joi.string().min(8),
  newPassword: Joi.string().min(8).max(72),
})
  .min(1)
  .custom((value, helpers) => {
    if (value.newPassword && !value.currentPassword) {
      return helpers.error("any.custom", {
        message: "Current password required when setting new password",
      });
    }
    return value;
  });
