import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import instance from "../../lib/axios";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/solid";
import { Tag, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import { getUserId } from "../../lib/userId";
import toast from "react-hot-toast";

export default function BookDetails() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingSold, setMarkingSold] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await instance.get(`/books/${id}`);
        setBook(response.data);
      } catch {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const ownerId = book ? String(book.owner?._id || book.owner) : null;
  const isOwner = userId && ownerId === userId;

  const handleMarkSold = async () => {
    setMarkingSold(true);
    try {
      const res = await instance.patch(`/books/${id}/sold`);
      setBook(res.data);
      toast.success(t("markedAsSold"));
    } catch {
      toast.error(t("errorMarkingSold"));
    } finally {
      setMarkingSold(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader className="animate-spin text-emerald-600" size={36} />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 container mx-auto px-4 py-16 text-center">
        <p className="text-slate-600">{t("bookNotFound")}</p>
        <Link
          to="/"
          className="text-emerald-600 hover:underline mt-4 inline-block"
        >
          {t("backHome")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 me-1" />
        {t("backHome")}
      </Link>

      <div className="max-w-5xl mx-auto glass-card rounded-2xl shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div className="relative">
            <img
              src={book.image}
              alt={book.title}
              className={`w-full rounded-xl shadow-md ${book.sold ? "opacity-70" : ""}`}
            />
            {book.sold && (
              <div className="absolute top-4 inset-s-4">
                <span className="bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow">
                  {t("soldBadge")}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              {book.title}
            </h1>

            <span className="inline-block w-fit px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-full mb-4">
              {t(
                {
                  male: "sectionMale",
                  female: "sectionFemale",
                  both: "sectionBoth",
                }[book.section] || "section",
              )}
            </span>

            <p className="text-slate-600 mb-6 leading-relaxed">
              {book.description}
            </p>

            <p className="text-3xl font-bold text-emerald-600 mb-6">
              ⃁{book.price}
            </p>

            {!book.sold && (
              <div className="space-y-3 mt-auto">
                {book.whatsapp && book.whatsapp !== "0" && (
                  <a
                    href={`https://wa.me/${book.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                    {t("contactOnWhatsApp")}
                  </a>
                )}
                {book.telegram && (
                  <a
                    href={`https://t.me/${book.telegram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-xl transition"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                    {t("contactOnTelegram")}
                  </a>
                )}
              </div>
            )}

            {isOwner && !book.sold && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={handleMarkSold}
                  disabled={markingSold}
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold disabled:opacity-50"
                >
                  {markingSold ? t("updating") : t("markAsSold")}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/edit/${book._id}`)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50"
                >
                  {t("edit")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
