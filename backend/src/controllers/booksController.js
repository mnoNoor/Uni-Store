import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export async function getAllBooks(_, res) {
  const books = await Book.find();
  res.status(200).json(books);
}

export async function getOneBook(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(book);
}

export async function createBook(req, res) {
  const { title, description, section, price } = req.body;

  if (!title || !req.file || !description || !section || price == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const publicId = `${Date.now()}-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "books",
    public_id: title.replace(/\s+/g, "-").toLowerCase(),
    width: 900,
    height: 1200,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "webp",
  });

  await fs.unlink(req.file.path);

  const newBook = new Book({
    title,
    image: result.secure_url,
    imagePublicId: result.public_id,
    description,
    section,
    price,
  });

  await newBook.save();
  res.status(201).json(newBook);
  console.log("Book created successfully");
}

export async function editBook(req, res) {
  const { title, description, section, price } = req.body;

  const toUpdate = { title, description, section, price };

  // If a new file was uploaded, upload to Cloudinary and replace
  if (req.file) {
    // find old book to get old public_id
    const oldBook = await Book.findById(req.params.id);
    if (!oldBook) return res.status(404).json({ message: "Book not found" });

    const newPublicId = `${Date.now()}-${title.replace(/\s+/g, "-").toLowerCase()}`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "books",
      public_id: newPublicId,
      width: 900,
      height: 1200,
      crop: "fill",
      gravity: "auto",
      quality: "auto",
      format: "webp",
    });

    // delete temp file
    await fs.unlink(req.file.path).catch(() => {});

    // destroy old image from Cloudinary if it exists
    if (oldBook.imagePublicId) {
      await cloudinary.uploader.destroy(oldBook.imagePublicId).catch(() => {});
    }

    toUpdate.image = result.secure_url;
    toUpdate.imagePublicId = result.public_id;
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, toUpdate, {
    new: true,
  });

  if (!updatedBook) {
    return res.status(404).json({ message: "Book not found" });
  }

  res.status(200).json(updatedBook);
}

export async function deleteBook(req, res) {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  if (!deletedBook) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.status(200).json(deletedBook);
}
