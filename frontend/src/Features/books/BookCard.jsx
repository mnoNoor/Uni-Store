import { PenSquareIcon, Trash2Icon, Tag } from "lucide-react";
import instance from "../../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function BookCard({ book, setBooks, currentUserId, showOwnerActions = true }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);
  const [markingSold, setMarkingSold] = useState(false);

  const ownerId = String(book.owner?._id || book.owner);
  const isOwner = currentUserId && ownerId === String(currentUserId);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(t("confirmDelete"))) return;

    setIsDeleting(true);
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success(t("bookDeleted"));
      if (setBooks) {
        setBooks((prev) => prev.filter((b) => b._id !== book._id));
      }
    } catch {
      toast.error(t("errorDeletingBook"));
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMarkSold = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMarkingSold(true);
    try {
      const res = await instance.patch(`/books/${book._id}/sold`);
      toast.success(t("markedAsSold"));
      if (setBooks) {
        setBooks((prev) =>
          prev.map((b) => (b._id === book._id ? res.data : b)),
        );
      }
    } catch {
      toast.error(t("errorMarkingSold"));
    } finally {
      setMarkingSold(false);
    }
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/edit/${book._id}`);
  };

  return (
    <article className="group glass-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <Link to={`/books/${book._id}`} className="block">
        <div className="relative aspect-[3/4] bg-slate-100 overflow-hidden">
          <img
            src={book.image || "/placeholder.png"}
            alt={book.title}
            loading="lazy"
            className={`w-full h-full object-contain ${book.sold ? "opacity-60 grayscale-[30%]" : ""}`}
          />
          {book.sold && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/35">
              <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg rotate-[-8deg]">
                {t("soldBadge")}
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h2 className="text-base font-bold text-slate-900 mb-1 line-clamp-1 group-hover:text-emerald-700 transition">
            {book.title}
          </h2>
          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{book.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-emerald-600">⃁{book.price}</span>
            {book.ownerUsername && (
              <span className="text-xs text-slate-400 truncate max-w-[40%]">
                @{book.ownerUsername}
              </span>
            )}
          </div>
        </div>
      </Link>

      {book.publisher && (
        <div className="px-4 pb-3 -mt-1">
          <Link
            to={`/publisher/${encodeURIComponent(book.publisher)}`}
            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-medium"
          >
            <Tag className="w-3 h-3" />
            {book.publisher}
          </Link>
        </div>
      )}

      {showOwnerActions && isOwner && !book.sold && (
        <div className="px-3 pb-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          <button
            type="button"
            onClick={handleMarkSold}
            disabled={markingSold}
            className="flex-1 min-w-[100px] text-xs font-semibold py-2 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 disabled:opacity-50"
          >
            {markingSold ? "..." : t("markAsSold")}
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            aria-label={t("edit")}
          >
            <PenSquareIcon size={18} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
            aria-label={t("delete")}
          >
            {isDeleting ? "..." : <Trash2Icon size={18} />}
          </button>
        </div>
      )}
    </article>
  );
}
