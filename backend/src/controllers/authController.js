import User from "../models/User";
import { generateTokenAndSetCookie } from "../utils/setCookie";

export async function signup(req, res) {
  const { username, email, password } = req.body;

  if (!username.trim() || !email.trim() || !password.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ $or: [{ email }, { username }] });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = new User({
    username: username.trim(),
    email: email.trim().toLowerCase(),
    password: password.trim(),
    verifyToken: null,
    verifyTokenExp: Date.now() + 60 * 60 * 24 * 1000, // 24 hours
  });

  await user.save();

  generateTokenAndSetCookie(res, user._id);

  res.status(201).json({ message: "User registered successfully", user: user });
}

export async function login(req, res) {
  await res.status(200).send("Login controller");
}

export async function logout(req, res) {
  await res.status(200).send("Logout controller");
}
