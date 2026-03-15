import { useState, useEffect } from "react";
import instance from "../../lib/axios";

import AddBookButton from "../books/AddBookButton";
import BookCard from "../books/BookCard";
import RateLimitedUI from "../shared/RateLimitedUI";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import SearchBar from "../shared/SearchBar";
import Pagination from "../shared/Pagination";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState(t("newest"));
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);

        const res = await instance.get(
          `/books?page=${page}&limit=12&search=${query}&sort=${sortBy}`,
        );

        if (!mounted) return;

        setBooks(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          console.error("Error fetching books:", error);
          setError("Could not load books. Try again later.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchBooks();

    return () => {
      mounted = false;
    };
  }, [page, query, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="container mx-auto flex-1 px-4 sm:px-6 lg:px-8 py-6">
        <SearchBar
          query={query}
          setQuery={setQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && isRateLimited && <RateLimitedUI />}

        {!loading && !isRateLimited && error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded text-red-700">
            {error}
          </div>
        )}

        {!loading && !isRateLimited && !error && books.length === 0 && (
          <div className="p-8 bg-white rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search or add a new book.
            </p>
          </div>
        )}

        {!loading && !isRateLimited && !error && books.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  setBooks={setBooks}
                  currentUserId={user?._id}
                />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </main>

      <AddBookButton />
    </div>
  );
}
