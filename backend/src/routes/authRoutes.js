import express from "express";
import {
  login,
  signup,
  logout,
  userAuth,
  updateProfile,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { logInUserValidator } from "../validators/logInUserValidator.js";
import { signUpUserValidator } from "../validators/signUpUserValidator.js";
import { updateProfileSchema } from "../validators/profileValidator.js";

const router = express.Router();

router.get("/user-auth", authMiddleware, asyncHandler(userAuth));
router.put(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  asyncHandler(updateProfile),
);
router.post("/login", validate(logInUserValidator), asyncHandler(login));
router.post("/signup", validate(signUpUserValidator), asyncHandler(signup));
router.post("/logout", asyncHandler(logout));

export default router;
