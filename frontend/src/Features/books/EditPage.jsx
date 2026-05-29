import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Trash2Icon, Loader, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import instance from "../../lib/axios";
import toast from "react-hot-toast";
import ImageUpload from "../shared/ImageUpload";
import ContactSection from "../shared/ContactSection";
import SectionPicker from "../shared/SectionPicker";
import ProtectedRoute from "../shared/ProtectedRoute";
import { getUserId } from "../../lib/userId";
import { useAuthStore } from "../../stores/authStore";

const BOOK_FIELDS = [
  "title",
  "publisher",
  "description",
  "section",
  "price",
  "whatsapp",
  "telegram",
];

function EditBookForm() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const userId = getUserId(user);

  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await instance.get(`/books/${id}`);
        const ownerId = String(res.data.owner?._id || res.data.owner);
        if (userId && ownerId !== userId) {
          toast.error(t("notAllowed"));
          navigate("/");
          return;
        }
        setForm(res.data);
      } catch {
        toast.error(t("fetchFailed"));
        setForm(null);
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchBook();
  }, [id, userId, navigate, t]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildFormData = () => {
    const formData = new FormData();
    for (const key of BOOK_FIELDS) {
      if (form[key] !== undefined && form[key] !== null) {
        formData.append(key, form[key]);
      }
    }
    if (image?.file) formData.append("image", image.file);
    return formData;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await instance.put(`/books/${id}`, buildFormData());
      toast.success(t("bookUpdatedSuccessfully"));
      navigate("/user");
    } catch (err) {
      toast.error(err.response?.data?.message || t("errorUpdatingBook"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("confirmDelete"))) return;
    setDeleting(true);
    try {
      await instance.delete(`/books/${id}`);
      toast.success(t("bookDeleted"));
      navigate("/user");
    } catch {
      toast.error(t("errorDeletingBook"));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <Loader className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex-1 flex items-center justify-center py-24 text-slate-600">
        {t("bookNotFound")}
      </div>
    );
  }

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <Link to="/" className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeftIcon className="h-5 w-5 me-2" />
          {t("backHome")}
        </Link>
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 disabled:opacity-50"
        >
          {deleting ? <Loader className="animate-spin" size={16} /> : <Trash2Icon size={16} />}
          {t("delete")}
        </button>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6">{t("editBook")}</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <ImageUpload
            image={image}
            setImage={setImage}
            existingUrl={!image?.file ? form.image : null}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("title")}</label>
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("publisher")}</label>
            <input
              value={form.publisher || ""}
              onChange={(e) => handleChange("publisher", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("description")}</label>
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t("section")}</label>
            <SectionPicker value={form.section} onChange={(v) => handleChange("section", v)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{t("price")}</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              min="0"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
              required
            />
          </div>

          <ContactSection
            whatsapp={form.whatsapp || ""}
            telegram={form.telegram || ""}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={saving || form.sold}
            className="w-full flex justify-center items-center gap-2 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? <Loader className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? t("updating") : t("saveChanges")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditPage() {
  return (
    <ProtectedRoute>
      <EditBookForm />
    </ProtectedRoute>
  );
}
