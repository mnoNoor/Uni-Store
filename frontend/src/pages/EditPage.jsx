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
  const [loading, setLoading] = useState(true);
  const [save, setSave] = useState(false);
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
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success("Book deleted successfully");
      setBook((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await instance.put(`/books/${book._id}`, book);
      toast.success("Book updated successfully");
      setSave(true);
      navigate(`/`);
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="btn btn-ghost">
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
              <label className="block mb-1 font-semibold">Image URL</label>
              <input
                type="text"
                value={book.image}
                onChange={(e) => setBook({ ...book, image: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
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
              <label className="block mb-1 font-semibold">Section</label>
              <input
                type="text"
                value={book.section}
                onChange={(e) => setBook({ ...book, section: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Price</label>
              <input
                type="number"
                value={book.price}
                onChange={(e) => setBook({ ...book, price: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={save}
              variant="primary"
            >
              {save ? "Saving..." : "Save"}
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
