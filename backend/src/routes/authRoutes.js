import express from "express";
import { login, signup, logout } from "../controllers/authController.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/login", asyncHandler(login));
router.post("/signup", asyncHandler(signup));
router.post("/logout", asyncHandler(logout));

export default router;
