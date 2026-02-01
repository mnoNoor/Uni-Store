import { PenSquareIcon, Trash2Icon } from "lucide-react";
import instance from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/format";

export default function ProductCard({ book, setBooks }) {
  const navigate = useNavigate();

  const handleDelete = async (e) => {
    // prevent Link / card click propagation
    e.stopPropagation();
    e.preventDefault();
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success("Book deleted successfully");
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch (error) {
      console.error("Error deleting book:", error);
      toast.error("Could not delete book");
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit/${book._id}`);
  };

  return (
    <article
      role="article"
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden flex flex-col"
    >
      <Link to={`/books/${book._id}`} className="group block flex-1">
        <div className="w-full aspect-w-4 aspect-h-3 bg-gray-100 overflow-hidden">
          <img
            src={book.image || "/placeholder.png"}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold leading-tight mb-1">
            {book.title}
          </h2>
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {book.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="text-green-600 font-semibold">
              {formatCurrency(book.price)}
            </div>
            <div className="text-xs text-gray-400">
              {book.author || "Unknown author"}
            </div>
          </div>
        </div>
      </Link>

      <div className="p-3 border-t bg-white flex items-center justify-end gap-2">
        <button
          onClick={handleEdit}
          aria-label={`Edit ${book.title}`}
          className="p-2 rounded hover:bg-gray-100"
        >
          <PenSquareIcon />
        </button>
        <button
          onClick={handleDelete}
          aria-label={`Delete ${book.title}`}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Trash2Icon />
        </button>
      </div>
    </article>
  );
}
