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
import { getUserId } from "../../lib/userId";

export default function Home() {
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();

  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;

    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: String(page),
          limit: "12",
          search: query,
          sort: sortBy,
        });
        if (section) params.set("section", section);

        const res = await instance.get(`/books?${params}`);

        if (!mounted) return;

        setBooks(res.data.data);
        setTotalPages(res.data.totalPages);
        setIsRateLimited(false);
      } catch (err) {
        if (!mounted) return;
        if (err.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          setError(t("loadBooksError"));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchBooks, 300);
    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [page, query, sortBy, section, t]);

  useEffect(() => {
    setPage(1);
  }, [query, sortBy, section]);

  const userId = getUserId(user);

  return (
    <div className="flex-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 rounded-2xl hero-gradient text-white p-6 sm:p-8 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            {t("heroTitle")}
          </h2>
          <p className="text-emerald-50/95 max-w-2xl">{t("heroSubtitle")}</p>
        </div>

        <SearchBar
          query={query}
          setQuery={setQuery}
          sortBy={sortBy}
          setSortBy={setSortBy}
          section={section}
          setSection={setSection}
        />

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && isRateLimited && <RateLimitedUI />}

        {!loading && !isRateLimited && error && (
          <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-red-700">
            {error}
          </div>
        )}

        {!loading && !isRateLimited && !error && books.length === 0 && (
          <div className="p-10 glass-card rounded-2xl text-center">
            <h3 className="text-lg font-semibold mb-2">{t("noBooksFound")}</h3>
            <p className="text-sm text-slate-600">{t("tryAdjustSearch")}</p>
          </div>
        )}

        {!loading && !isRateLimited && !error && books.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {books.map((book) => (
                <BookCard
                  key={book._id}
                  book={book}
                  setBooks={setBooks}
                  currentUserId={userId}
                />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} setPage={setPage} />
          </>
        )}
      </div>
      <AddBookButton />
    </div>
  );
}
