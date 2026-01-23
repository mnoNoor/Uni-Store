import express from "express";
import {
  getAllBooks,
  createBook,
  editBook,
  deleteBook,
} from "../controllers/booksController.js";
const router = express.Router();

router.get("/", getAllBooks);
router.post("/", createBook);
router.put("/:id", editBook);
router.delete("/:id", deleteBook);

export default router;
