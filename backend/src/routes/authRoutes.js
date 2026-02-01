import express from "express";
import {
  login,
  signup,
  logout,
  userAuth,
} from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.js";
import { validate } from "../middlewares/validation.js";
import { validateUserSchema } from "../validators/userValidator.js";

const router = express.Router();

router.get("/user-auth", authMiddleware, asyncHandler(userAuth));
router.post("/login", validate(validateUserSchema), asyncHandler(login));
router.post("/signup", asyncHandler(signup));
router.post("/logout", asyncHandler(logout));

export default router;
