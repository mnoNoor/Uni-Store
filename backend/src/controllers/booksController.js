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
  const { title, description, section, price, whatsapp, telegram } = req.body;

  if (!title || !req.file || !description || !section || price == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (!whatsapp && !telegram) {
    return res.status(400).json({ message: "Please add a contact way" });
  }

  const publicId = `${Date.now()}-${title.replace(/\s+/g, "-").toLowerCase()}`;

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "books",
    public_id: publicId,
    width: 900,
    height: 1200,
    crop: "fill",
    gravity: "auto",
    quality: "auto",
    format: "webp",
  });

  await fs.unlink(req.file.path);

  const newBook = new Book({
    owner: req.userId,
    title,
    image: result.secure_url,
    imagePublicId: result.public_id,
    description,
    section,
    price,
    whatsapp,
    telegram,
  });

  await newBook.save();
  res.status(201).json(newBook);
  console.log("Book created successfully");
}

export async function editBook(req, res) {
  const { title, description, section, price, whatsapp, telegram } = req.body;

  const toUpdate = { title, description, section, price, whatsapp, telegram };

  if (req.file) {
    const oldBook = await Book.findById(req.params.id);
    if (!oldBook) return res.status(404).json({ message: "Book not found" });

    if (oldBook.owner.toString() !== req.userId.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }

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

    await fs.unlink(req.file.path).catch(() => {});

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
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.imagePublicId) {
    await cloudinary.uploader.destroy(book.imagePublicId).catch(() => {});
  }

  await book.deleteOne();

  res.status(200).json(book);
}
