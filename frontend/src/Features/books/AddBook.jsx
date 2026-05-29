import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon, Loader } from "lucide-react";
import toast from "react-hot-toast";
import instance from "../../lib/axios";
import RateLimitedUI from "../shared/RateLimitedUI";
import ImageUpload from "../shared/ImageUpload";
import ContactSection from "../shared/ContactSection";
import SectionPicker from "../shared/SectionPicker";
import ProtectedRoute from "../shared/ProtectedRoute";
import { useTranslation } from "react-i18next";

function AddBookForm() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    title: "",
    publisher: "",
    description: "",
    section: "",
    price: "",
    whatsapp: "",
    telegram: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image || !form.title || !form.description || !form.section || !form.price) {
      toast.error(t("fillRequiredFields"));
      return;
    }
    if (!form.whatsapp && !form.telegram) {
      toast.error(t("contactRequired"));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value);
      });
      formData.append("image", image.file);

      await instance.post("/books", formData);
      toast.success(t("bookAdded"));
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true);
      } else {
        toast.error(error.response?.data?.message || t("errorAddingBook"));
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRateLimited) return <RateLimitedUI />;

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <Link
        to="/"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeftIcon className="w-5 h-5 me-2" />
        {t("backHome")}
      </Link>

      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{t("addNewBook")}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUpload image={image} setImage={setImage} />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t("title")} <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder={t("titlePlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t("publisher")}
            </label>
            <input
              name="publisher"
              value={form.publisher}
              onChange={handleChange}
              placeholder={t("publisherPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t("description")} <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder={t("descriptionPlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 resize-none focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("section")} <span className="text-red-500">*</span>
            </label>
            <SectionPicker
              value={form.section}
              onChange={(section) => setForm({ ...form, section })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t("price")} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder={t("pricePlaceholder")}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <ContactSection
            whatsapp={form.whatsapp}
            telegram={form.telegram}
            onChange={(field, value) => setForm({ ...form, [field]: value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading && <Loader className="animate-spin" size={18} />}
            {loading ? t("adding") : t("addBook")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddBook() {
  return (
    <ProtectedRoute>
      <AddBookForm />
    </ProtectedRoute>
  );
}
