import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateTokenAndSetCookie,
  clearAuthCookie,
} from "../utils/setCookie.js";
import { serializeUser } from "../utils/serializeUser.js";

export async function signup(req, res) {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { username }],
  });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = new User({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password,
  });

  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({
    message: "User registered successfully",
    user: serializeUser(user),
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password",
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  generateTokenAndSetCookie(res, user._id);

  user.lastLogin = new Date();
  await user.save();

  res.status(200).json({
    message: "User logged in successfully",
    user: serializeUser(user),
  });
}

export async function logout(req, res) {
  clearAuthCookie(res);
  res.status(200).json({ message: "User logged out successfully" });
}

export async function userAuth(req, res) {
  const user = await User.findById(req.userId);

  if (!user) return res.status(401).json({ message: "User not found" });

  res.status(200).json({ user: serializeUser(user) });
}

export async function updateProfile(req, res) {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { username, email, currentPassword, newPassword } = req.body;

  if (username && username !== user.username) {
    const taken = await User.findOne({ username });
    if (taken) {
      return res.status(409).json({ message: "Username already taken" });
    }
    user.username = username.trim();
  }

  if (email && email.toLowerCase() !== user.email) {
    const taken = await User.findOne({ email: email.toLowerCase() });
    if (taken) {
      return res.status(409).json({ message: "Email already in use" });
    }
    user.email = email.toLowerCase().trim();
  }

  if (newPassword) {
    if (!currentPassword) {
      return res
        .status(400)
        .json({ message: "Current password is required to set a new password" });
    }
    const userWithPwd = await User.findById(req.userId).select("+password");
    const valid = await bcrypt.compare(currentPassword, userWithPwd.password);
    if (!valid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }
    user.password = newPassword;
  }

  await user.save();

  res.status(200).json({
    message: "Profile updated",
    user: serializeUser(user),
  });
}
