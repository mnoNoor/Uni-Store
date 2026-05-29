import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import BookCard from "../books/BookCard";
import instance from "../../lib/axios";
import { useAuthStore } from "../../stores/authStore";
import { getUserId } from "../../lib/userId";

export default function UserBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAuthStore((s) => s.user);
  const { t } = useTranslation();
  const userId = getUserId(user);

  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const booksRes = await instance.get("/books/user/me");
        setBooks(booksRes.data);
        setError(null);
      } catch {
        setError(t("fetchFailed"));
      } finally {
        setLoading(false);
      }
    };
    fetchUserBooks();
  }, [t]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader className="animate-spin text-emerald-600 mb-3" size={32} />
        <p className="text-slate-600">{t("loadingYourBooks")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-600 mb-3">{error}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
        >
          {t("tryAgain")}
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
        <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-700 mb-2">{t("noBooksYet")}</h3>
        <p className="text-slate-500 mb-6">{t("noBooksInCollection")}</p>
        <Link
          to="/add-book"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition font-medium"
        >
          {t("addYourFirstBook")}
        </Link>
      </div>
    );
  }

  const active = books.filter((b) => !b.sold);
  const sold = books.filter((b) => b.sold);

  return (
    <div className="space-y-8">
      {active.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-4">
            {t("activeListings")} ({active.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                setBooks={setBooks}
                currentUserId={userId}
              />
            ))}
          </div>
        </div>
      )}

      {sold.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 mb-4">
            {t("soldListings")} ({sold.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sold.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                setBooks={setBooks}
                currentUserId={userId}
                showOwnerActions={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
