import User from "../models/User.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!["admin", "superadmin"].includes(user.role)) {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.adminUser = user;
    next();
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.role !== "superadmin") {
      return res.status(403).json({ message: "Super admin access required" });
    }
    req.adminUser = user;
    next();
  } catch {
    return res.status(500).json({ message: "Internal server error" });
  }
};
