import Book from "../models/Book.js";

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
  const { title, image, description, section, price } = req.body;

  if (!title || !image || !description || !section || price == null) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const newBook = new Book({
    title,
    image,
    description,
    section,
    price,
  });

  await newBook.save();
  res.status(201).json(newBook);
  console.log("Book created successfully");
}

export async function editBook(req, res) {
  const { title, image, description, section, price } = req.body;
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title,
      image,
      description,
      section,
      price,
    },
    { new: true },
  );
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
