import Book from "../models/Book.js";

export async function getAllBooks(_, res) {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOneBook(req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBook(req, res) {
  try {
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
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function editBook(req, res) {
  try {
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
  } catch (error) {
    console.error("Error editing book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteBook(req, res) {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(deletedBook);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
