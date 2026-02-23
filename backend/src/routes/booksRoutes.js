import express from "express";
import {
  getAllBooks,
  getOneBook,
  createBook,
  editBook,
  deleteBook,
  getUserBooks,
} from "../controllers/booksController.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../middlewares/upload.js";
import { validateBookSchema } from "../validators/bookValidator.js";
import { validate } from "../middlewares/validation.js";
import { updateBookSchema } from "../validators/updateBookValidator.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", asyncHandler(getAllBooks));
router.get("/user/me", authMiddleware, asyncHandler(getUserBooks));
router.get("/:id", asyncHandler(getOneBook));
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(validateBookSchema),
  asyncHandler(createBook),
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  validate(updateBookSchema),
  asyncHandler(editBook),
);
router.delete("/:id", authMiddleware, asyncHandler(deleteBook));

export default router;
