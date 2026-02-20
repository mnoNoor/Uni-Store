import instance from "../lib/axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BookCard from "../layout/BookCard";

export default function UserBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const res = await instance.get("/books");

        const ownerRes = await instance.get("/auth/user-auth");
        const currentUserId = ownerRes.data.userId;

        const userBooks = res.data.filter(
          (book) => book.owner === currentUserId,
        );

        setBooks(userBooks);
      } catch (error) {
        console.error("Error fetching user books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  if (loading) {
    return (
      <div className="text-lg font-semibold animate-pulse text-gray-700">
        Loading books...
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-lg font-semibold text-gray-700">
        No books available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map((book) => (
        <Link key={book._id} to={`/books/${book._id}`}>
          <BookCard book={book} setBooks={setBooks} />
        </Link>
      ))}
    </div>
  );
}
