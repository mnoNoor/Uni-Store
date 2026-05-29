import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";
import { serializeUser } from "../utils/serializeUser.js";

export async function getStats(req, res) {
  const [usersCount, booksCount, soldCount, activeListings] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Book.countDocuments({ sold: true }),
    Book.countDocuments({ sold: false }),
  ]);

  const recentUsers = await User.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .select("username email role createdAt");

  const recentBooks = await Book.find()
    .populate("owner", "username")
    .sort({ createdAt: -1 })
    .limit(5)
    .select("title price sold createdAt owner");

  res.status(200).json({
    usersCount,
    booksCount,
    soldCount,
    activeListings,
    recentUsers,
    recentBooks,
  });
}

export async function getAllUsers(req, res) {
  const users = await User.find()
    .sort({ createdAt: -1 })
    .select("-password -verifyToken -verifyTokenExp -pwdResetToken -pwdResetExp");
  res.status(200).json(users.map(serializeUser));
}

export async function getAllBooksAdmin(req, res) {
  const books = await Book.find()
    .populate("owner", "username email")
    .sort({ createdAt: -1 });
  res.status(200).json(books);
}

export async function deleteUser(req, res) {
  const target = await User.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  if (target.role === "superadmin") {
    return res.status(403).json({ message: "Cannot delete super admin" });
  }

  if (
    target.role === "admin" &&
    req.adminUser.role !== "superadmin" &&
    target._id.toString() !== req.adminUser._id.toString()
  ) {
    return res.status(403).json({ message: "Only super admin can remove admins" });
  }

  if (target._id.toString() === req.adminUser._id.toString()) {
    return res.status(400).json({ message: "Cannot delete your own account here" });
  }

  const books = await Book.find({ owner: target._id });
  for (const book of books) {
    if (book.imagePublicId) {
      await cloudinary.uploader.destroy(book.imagePublicId).catch(() => {});
    }
  }
  await Book.deleteMany({ owner: target._id });
  await target.deleteOne();

  res.status(200).json({ message: "User deleted" });
}

export async function deleteBookAdmin(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.imagePublicId) {
    await cloudinary.uploader.destroy(book.imagePublicId).catch(() => {});
  }
  await book.deleteOne();
  res.status(200).json({ message: "Book deleted" });
}

export async function resetUserPassword(req, res) {
  const { password } = req.body;
  if (!password || password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters" });
  }

  const target = await User.findById(req.params.id);
  if (!target) {
    return res.status(404).json({ message: "User not found" });
  }

  if (target.role === "superadmin" && req.adminUser.role !== "superadmin") {
    return res.status(403).json({ message: "Not allowed" });
  }

  target.password = password;
  await target.save();

  res.status(200).json({ message: "Password updated" });
}

export async function promoteToAdmin(req, res) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.role === "superadmin") {
    return res.status(400).json({ message: "User is already super admin" });
  }

  user.role = "admin";
  await user.save();

  res.status(200).json({
    message: "User promoted to admin",
    user: serializeUser(user),
  });
}
