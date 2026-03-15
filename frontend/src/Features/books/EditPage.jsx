import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Trash2Icon, Loader, Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import instance from "../../lib/axios";
import toast from "react-hot-toast";
import ImageUpload from "../shared/ImageUpload";
import ContactSection from "../shared/ContactSection";

export default function EditPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await instance.get(`/books/${id}`);
        setForm(res.data);
      } catch {
        toast.error("Could not load book");
        setForm(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const buildFormData = () => {
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value ?? "");
    });

    if (image?.file) {
      formData.append("image", image.file);
    }

    return formData;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await instance.put(`/books/${id}`, buildFormData());
      toast.success(t("bookUpdated"));
      navigate("/");
    } catch {
      toast.error(t("updateFailed"));
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(t("deleteConfirmation"))) return;

    setDeleting(true);
    try {
      await instance.delete(`/books/${id}`);
      toast.success(t("bookDeleted"));
      navigate("/");
    } catch {
      toast.error(t("deleteFailed"));
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-green-600" size={28} />
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">{t("bookNotFound")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            {t("backHome")}
          </Link>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
          >
            {deleting ? (
              <Loader className="animate-spin" size={16} />
            ) : (
              <Trash2Icon size={16} />
            )}
            {t("delete")}
          </button>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6">{t("editBook")}</h1>

          <form onSubmit={handleSave} className="space-y-6">
            <ImageUpload
              image={image}
              setImage={setImage}
              initialPreview={form.image}
            />
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("title")} <span className="text-red-600 text-lg">*</span>
              </label>
              <input
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("description")}
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full px-4 py-2 border rounded-lg resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("section")} <span className="text-red-600 text-lg">*</span>
              </label>
              <div className="flex gap-3">
                {[t("male"), t("female"), t("both")].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange("section", value)}
                    className={`px-5 py-2 rounded-lg ${
                      form.section === value
                        ? "bg-green-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("price")} <span className="text-red-600 text-lg">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
            </div>

            <ContactSection
              whatsapp={form.whatsapp}
              telegram={form.telegram}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={saving}
              className={`w-full flex justify-center items-center py-3 rounded-lg text-white ${
                saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {saving ? (
                <Loader className="animate-spin" size={18} />
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  {t("saveChanges")}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
