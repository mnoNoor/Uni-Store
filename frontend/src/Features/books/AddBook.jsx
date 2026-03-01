import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ArrowLeftIcon, Loader } from "lucide-react";

import ContactSection from "../shared/ContactSection";
import toast from "react-hot-toast";
import instance from "../../lib/axios";
import RateLimitedUI from "../shared/RateLimitedUI";
import ImageUpload from "../shared/ImageUpload";

export default function AddBook() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    section: "",
    price: "",
    whatsapp: "",
    telegram: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const sections = ["male", "female", "both"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { title, description, section, price, whatsapp, telegram } = form;

    if (!image || !title || !description || !section || !price) {
      toast.error("All required fields must be filled");
      return false;
    }

    if (!whatsapp && !telegram) {
      toast.error("Add WhatsApp or Telegram contact");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      formData.append("image", image.file);

      await instance.post("/books", formData);

      toast.success("Book added successfully");
      navigate("/");
    } catch (error) {
      if (error.response?.status === 429) {
        setIsRateLimited(true);
        toast.error("Too many requests. Slow down.");
      } else {
        toast.error("Failed to add book");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isRateLimited) return <RateLimitedUI />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Add New Book
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Book Image
              </label>
              <ImageUpload image={image} setImage={setImage} />
            </div>

            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Book Title <span className="text-red-600 text-lg">*</span>
              </label>
              <input
                id="title"
                name="title"
                placeholder="Enter book title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description <span className="text-red-600 text-lg">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter book description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 border rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Section <span className="text-red-600 text-lg">*</span>
              </label>
              <div className="flex gap-3">
                {sections.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, section: value })}
                    className={`px-6 py-2 rounded-lg transition ${
                      form.section === value
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
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
                Price <span className="text-red-600 text-lg">*</span>
              </label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder="Enter price"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader className="animate-spin mr-2" size={18} />
                  Adding...
                </div>
              ) : (
                "Add Book"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
