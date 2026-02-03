import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateTokenAndSetCookie } from "../utils/setCookie.js";

export async function signup(req, res) {
  const { username, email, password } = req.body;

  if (!username?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

  const user = new User({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    verifyToken,
    verifyTokenExp: Date.now() + 60 * 60 * 24 * 1000, // 24 hours
  });

  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    return res
      .status(401)
      .json({ message: "You don't have an account, please sign in" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res
      .status(401)
      .json({ message: "Password in incorrect. please try again" });
  }

  generateTokenAndSetCookie(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({ message: "User logged in successfully" });
}

export async function logout(req, res) {
  await res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

export async function userAuth(req, res) {
  const user = await User.findById(req.userId);

  if (!user) return res.status(401).json({ message: "User not found" });

  res.status(200).json({ user });
}
