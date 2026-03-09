import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";

export async function getAllBooks(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const search = req.query.search || "";
  const sort = req.query.sort || "newest";
  const section = req.query.section;

  const skip = (page - 1) * limit;

  const filter = {
    // sold: true,
    ...(search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {}),
  };

  if (section && ["male", "female", "both"].includes(section)) {
    filter.section = section;
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price-asc") sortOption = { price: 1 };
  if (sort === "price-desc") sortOption = { price: -1 };

  const books = await Book.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(filter);

  res.status(200).json({
    data: books,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalItems: total,
  });
}

export async function getUserBooks(req, res) {
  const books = await Book.find({ owner: req.userId });
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

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "books",
      public_id: publicId,
      width: 900,
      height: 1200,
      crop: "limit",
      quality: "auto",
      format: "webp",
    });
    await fs.unlink(req.file.path);
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ message: "Error uploading image" });
  }

  const newBook = new Book({
    owner: req.userId,
    title,
    image: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
    description,
    section,
    price: parseFloat(price),
    whatsapp,
    telegram,
  });

  await newBook.save();
  res.status(201).json(newBook);
}

export async function editBook(req, res) {
  const { title, description, section, price, whatsapp, telegram } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const toUpdate = { title, description, section, price, whatsapp, telegram };

  if (req.file) {
    const newPublicId = `${Date.now()}-${(title || book.title).replace(/\s+/g, "-").toLowerCase()}`;

    try {
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

      if (book.imagePublicId) {
        await cloudinary.uploader.destroy(book.imagePublicId).catch(() => {});
      }

      toUpdate.image = result.secure_url;
      toUpdate.imagePublicId = result.public_id;
    } finally {
      await fs.unlink(req.file.path).catch(() => {});
    }
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, toUpdate, {
    new: true,
  });

  res.status(200).json(updatedBook);
}

export async function deleteBook(req, res) {
  const book = await Book.findById(req.params.id);

  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  if (book.imagePublicId) {
    await cloudinary.uploader.destroy(book.imagePublicId).catch(() => {});
  }

  await book.deleteOne();

  res.status(200).json(book);
}
