import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import User from "../models/User.js";

const bootstrapSuperAdmin = async () => {
  const email = process.env.SUPERADMIN_EMAIL?.toLowerCase().trim();
  if (!email) return;

  const existing = await User.findOne({ role: "superadmin" });
  if (existing) return;

  const user = await User.findOne({ email });
  if (user) {
    user.role = "superadmin";
    await user.save();
    console.log(`Super admin assigned to ${email}`);
  }
};

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
    await bootstrapSuperAdmin();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
