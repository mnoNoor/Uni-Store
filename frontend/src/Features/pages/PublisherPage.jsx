import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import instance from "../../lib/axios";
import BookCard from "../books/BookCard";
import LoadingSkeleton from "../shared/LoadingSkeleton";
import Pagination from "../shared/Pagination";
import { useAuthStore } from "../../stores/authStore";
import { getUserId } from "../../lib/userId";

export default function PublisherPage() {
  const { publisher: publisherParam } = useParams();
  const publisher = decodeURIComponent(publisherParam || "");
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [books, setBooks] = useState([]);
  const [displayName, setDisplayName] = useState(publisher);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await instance.get(
          `/books/by-publisher/${encodeURIComponent(publisher)}?page=${page}&limit=12`,
        );
        if (!mounted) return;
        setBooks(res.data.data);
        setDisplayName(res.data.publisher || publisher);
        setTotalPages(res.data.totalPages);
      } catch {
        if (mounted) setBooks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [publisher, page]);

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 me-1" />
        {t("backHome")}
      </Link>

      <div className="flex items-center gap-4 mb-8 p-6 rounded-2xl hero-gradient text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
          <BookOpen className="w-7 h-7" />
        </div>
        <div>
          <p className="text-emerald-100 text-sm">{t("publisherPageLabel")}</p>
          <h1 className="text-2xl font-bold">{displayName}</h1>
          <p className="text-emerald-50/90 text-sm mt-1">{t("publisherPageSubtitle")}</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center text-slate-600">
          {t("noBooksFound")}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                setBooks={setBooks}
                currentUserId={getUserId(user)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        </>
      )}
    </div>
  );
}
