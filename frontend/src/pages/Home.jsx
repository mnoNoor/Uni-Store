import { useState, useEffect, useMemo } from "react";
import instance from "../lib/axios";

import Header from "../layout/Header";
import AddBookButton from "../layout/AddBookButton";
import NavBar from "../layout/NavBar";
import ProductCard from "../layout/BookCard";
import RateLimitedUI from "../components/RateLimitedUI";
import Footer from "../layout/Footer";
import LoadingSkeleton from "../components/LoadingSkeleton";
import SearchBar from "../components/SearchBar";

export default function Home() {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let mounted = true;
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await instance.get("/books");
        if (!mounted) return;
        setBooks(res.data);
      } catch (err) {
        if (err.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          console.error("Error fetching books:", err);
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
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        (b.author || "").toLowerCase().includes(q),
    );

    if (sortBy === "price-asc") {
      list = [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      list = [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
    }

    return list;
  }, [books, query, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <NavBar />
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

        {!loading && !isRateLimited && !error && filtered.length === 0 && (
          <div className="p-8 bg-white rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-2">No books found</h3>
            <p className="text-sm text-gray-600">
              Try adjusting your search or add a new book.
            </p>
          </div>
        )}

        {!loading && !isRateLimited && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((book) => (
              <ProductCard key={book._id} book={book} setBooks={setBooks} />
            ))}
          </div>
        )}
      </main>

      <AddBookButton />
      <Footer />
    </div>
  );
}
