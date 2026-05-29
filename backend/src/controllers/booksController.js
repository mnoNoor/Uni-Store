import Book from "../models/Book.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs/promises";
import { BOOK_SECTIONS } from "../constants/sections.js";

const populateOwner = { path: "owner", select: "username image" };

const formatBook = (book) => {
  const doc = book.toObject ? book.toObject() : book;
  const owner = doc.owner;
  return {
    ...doc,
    owner: owner?._id || owner,
    ownerUsername: owner?.username,
    ownerImage: owner?.image,
  };
};

export async function getAllBooks(req, res) {
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);
  const search = (req.query.search || "").trim();
  const publisher = (req.query.publisher || "").trim();
  const sort = req.query.sort || "newest";
  const section = req.query.section;

  const skip = (page - 1) * limit;

  const filter = { sold: false };

  if (section && BOOK_SECTIONS.includes(section)) {
    filter.section = section;
  }

  if (publisher) {
    filter.publisher = { $regex: publisher, $options: "i" };
  }

  if (search) {
    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("_id");
    const ownerIds = users.map((u) => u._id);

    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { publisher: { $regex: search, $options: "i" } },
      ...(ownerIds.length ? [{ owner: { $in: ownerIds } }] : []),
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price-asc") sortOption = { price: 1 };
  if (sort === "price-desc") sortOption = { price: -1 };

  const books = await Book.find(filter)
    .populate(populateOwner)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(filter);

  res.status(200).json({
    data: books.map(formatBook),
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  });
}

export async function getBooksByPublisher(req, res) {
  const publisher = decodeURIComponent(req.params.publisher || "").trim();
  if (!publisher) {
    return res.status(400).json({ message: "Publisher name is required" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 12, 50);
  const skip = (page - 1) * limit;

  const filter = {
    publisher: { $regex: new RegExp(`^${publisher.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
    sold: false,
  };

  const books = await Book.find(filter)
    .populate(populateOwner)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(filter);

  const distinct = await Book.distinct("publisher", {
    publisher: { $regex: publisher, $options: "i" },
    sold: false,
  });

  res.status(200).json({
    publisher: distinct[0] || publisher,
    data: books.map(formatBook),
    currentPage: page,
    totalPages: Math.ceil(total / limit) || 1,
    totalItems: total,
  });
}

export async function listPublishers(req, res) {
  const q = (req.query.q || "").trim();
  const match = { sold: false, publisher: { $exists: true, $ne: "" } };
  if (q) {
    match.publisher = { $regex: q, $options: "i" };
  }

  const publishers = await Book.aggregate([
    { $match: match },
    { $group: { _id: "$publisher", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
    { $project: { _id: 0, name: "$_id", count: 1 } },
  ]);

  res.status(200).json(publishers);
}

export async function getUserBooks(req, res) {
  const books = await Book.find({ owner: req.userId })
    .populate(populateOwner)
    .sort({ createdAt: -1 });
  res.status(200).json(books.map(formatBook));
}

export async function getOneBook(req, res) {
  const book = await Book.findById(req.params.id).populate(populateOwner);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (book.sold) {
    const ownerId = book.owner._id?.toString() || book.owner.toString();
    let isAdmin = false;
    if (req.userId) {
      const viewer = await User.findById(req.userId).select("role");
      isAdmin = viewer && ["admin", "superadmin"].includes(viewer.role);
    }
    const isOwner = req.userId && ownerId === req.userId;
    if (!isOwner && !isAdmin) {
      return res.status(404).json({ message: "Book not found" });
    }
  }

  res.status(200).json(formatBook(book));
}

export async function createBook(req, res) {
  const { title, description, section, price, whatsapp, telegram, publisher } =
    req.body;

  if (!whatsapp && !telegram) {
    return res.status(400).json({ message: "Please add a contact way" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Book image is required" });
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
  } catch {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(500).json({ message: "Error uploading image" });
  }

  const newBook = new Book({
    owner: req.userId,
    title,
    publisher: publisher?.trim() || undefined,
    image: uploadResult.secure_url,
    imagePublicId: uploadResult.public_id,
    description,
    section,
    price: parseFloat(price),
    whatsapp: whatsapp || undefined,
    telegram: telegram || undefined,
  });

  await newBook.save();
  await newBook.populate(populateOwner);
  res.status(201).json(formatBook(newBook));
}

export async function editBook(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  const allowed = [
    "title",
    "description",
    "section",
    "price",
    "whatsapp",
    "telegram",
    "publisher",
  ];
  const toUpdate = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined && req.body[key] !== "") {
      toUpdate[key] =
        key === "price" ? parseFloat(req.body[key]) : req.body[key];
    }
  }

  if (req.file) {
    const newPublicId = `${Date.now()}-${(toUpdate.title || book.title).replace(/\s+/g, "-").toLowerCase()}`;

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
  }).populate(populateOwner);

  res.status(200).json(formatBook(updatedBook));
}

export async function markBookSold(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  if (book.owner.toString() !== req.userId) {
    return res.status(403).json({ message: "Not allowed" });
  }

  book.sold = true;
  await book.save();
  await book.populate(populateOwner);
  res.status(200).json(formatBook(book));
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

  res.status(200).json({ message: "Book deleted" });
}
