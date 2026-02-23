import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Loader } from "lucide-react";

import BookCard from "../books/BookCard";
import instance from "../../lib/axios";

export default function UserBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const booksRes = await instance.get("/books/user/me");

        const userRes = await instance.get("/auth/user-auth");
        const currentUserId = userRes.data.user._id;

        const userBooks = booksRes.data.filter(
          (book) => book.owner === currentUserId,
        );

        setBooks(userBooks);
        setError(null);
      } catch (error) {
        console.error("Error fetching user books:", error);
        setError("Failed to load your books");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="animate-spin text-indigo-600 mb-3" size={32} />
        <p className="text-gray-600">Loading your books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Books Yet
        </h3>
        <p className="text-gray-500 mb-6">
          You haven't added any books to your collection.
        </p>
        <Link
          to="/add-book"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          Add Your First Book
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Your Books ({books.length})
        </h2>
        <Link
          to="/add-book"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition text-sm flex items-center gap-1"
        >
          <span>+</span> Add New
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book._id} className="relative group">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}
