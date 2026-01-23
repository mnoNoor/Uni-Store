export function getAllBooks(req, res) {
  res.status(200).json({ message: "Get all books" });
}

export function createBook(req, res) {
  res.status(201).json({ message: "Book created successfully" });
}

export function editBook(req, res) {
  const { id } = req.params;
  res.status(200).json({ message: `Book ${id} updated successfully` });
}

export function deleteBook(req, res) {
  const { id } = req.params;
  res.status(200).json({ message: `Book ${id} deleted successfully` });
}
