import express from "express";
import {
  getStats,
  getAllUsers,
  getAllBooksAdmin,
  deleteUser,
  deleteBookAdmin,
  resetUserPassword,
  promoteToAdmin,
} from "../controllers/adminController.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authMiddleware } from "../middlewares/auth.js";
import { requireAdmin, requireSuperAdmin } from "../middlewares/admin.js";
import { validate } from "../middlewares/validation.js";
import {
  resetPasswordSchema,
  promoteAdminSchema,
} from "../validators/adminValidator.js";

const router = express.Router();

router.use(authMiddleware, requireAdmin);

router.get("/stats", asyncHandler(getStats));
router.get("/users", asyncHandler(getAllUsers));
router.get("/books", asyncHandler(getAllBooksAdmin));
router.delete("/users/:id", asyncHandler(deleteUser));
router.delete("/books/:id", asyncHandler(deleteBookAdmin));
router.patch(
  "/users/:id/password",
  validate(resetPasswordSchema),
  asyncHandler(resetUserPassword),
);
router.post(
  "/admins",
  requireSuperAdmin,
  validate(promoteAdminSchema),
  asyncHandler(promoteToAdmin),
);

export default router;
