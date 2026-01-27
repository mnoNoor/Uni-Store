import express from "express";
import {
  getAllBooks,
  getOneBook,
  createBook,
  editBook,
  deleteBook,
} from "../controllers/booksController.js";
import asyncHandler from "../utils/asyncHandler.js";
const router = express.Router();

router.get("/", asyncHandler(getAllBooks));
router.get("/:id", asyncHandler(getOneBook));
router.post("/", asyncHandler(createBook));
router.put("/:id", asyncHandler(editBook));
router.delete("/:id", asyncHandler(deleteBook));

export default router;
