import express from "express";
import {
  getAllBooks,
  getOneBook,
  createBook,
  editBook,
  deleteBook,
} from "../controllers/booksController.js";
import asyncHandler from "../utils/asyncHandler.js";
import upload from "../middlewares/upload.js";
import { validateBookSchema } from "../validators/bookValidator.js";
import { validate } from "../middlewares/validation.js";
import { updateBookSchema } from "../validators/updateBookValidator.js";

const router = express.Router();

router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getOneBook));
router.post(
  "/",
  upload.single("image"),
  validate(validateBookSchema),
  asyncHandler(createBook),
);
router.put(
  "/:id",
  upload.single("image"),
  validate(updateBookSchema),
  asyncHandler(editBook),
);
router.delete("/:id", asyncHandler(deleteBook));

export default router;
