import { useState, useEffect } from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { Link, useParams, useNavigate } from "react-router-dom";
import instance from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Trash2Icon } from "lucide-react";

export default function EditPage() {
  const [book, setBook] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await instance.get(`/books/${id}`);
        setBook(res.data);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success("Book deleted successfully");
      navigate("/");
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", book.title);
      formData.append("description", book.description);
      formData.append("section", book.section);
      formData.append("price", book.price);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await instance.put(`/books/${book._id}`, formData);

      toast.success("Book updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    } finally {
      setSaving(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="grow container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="btn btn-ghost flex items-center gap-2">
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Notes
          </Link>

          <button onClick={handleDelete} className="btn btn-error btn-outline">
            <Trash2Icon className="h-5 w-5" />
            Delete Note
          </button>
        </div>

        {loading ? (
          <p>Loading book details...</p>
        ) : book ? (
          <form className="space-y-4" onSubmit={handleSave}>
            <div>
              <label className="block mb-1 font-semibold">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full border border-gray-300 p-2 rounded"
              />
              {book.image && !imageFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Current image will be kept
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-semibold">Title</label>
              <input
                type="text"
                value={book.title}
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Description</label>
              <textarea
                value={book.description}
                onChange={(e) =>
                  setBook({ ...book, description: e.target.value })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Section</label>
              <div className="flex gap-2">
                {["male", "female", "both"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBook({ ...book, section: value })}
                    className={`px-4 py-2 rounded border font-medium ${
                      book.section === value
                        ? "bg-green-500 text-white border-green-500"
                        : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={book.price}
                onChange={(e) =>
                  setBook({ ...book, price: Number(e.target.value) })
                }
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <p>Book not found</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
