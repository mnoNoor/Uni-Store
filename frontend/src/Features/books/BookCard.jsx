import { PenSquareIcon, Trash2Icon } from "lucide-react";
import instance from "../../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/format";
import { useState } from "react";

export default function BookCard({ book, setBooks, currentUserId }) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = currentUserId && book.owner === currentUserId;

  const handleDelete = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!window.confirm(`Delete "${book.title}"?`)) return;

    setIsDeleting(true);
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success("Book deleted");
      setBooks((prev) => prev.filter((b) => b._id !== book._id));
    } catch (error) {
      toast.error("Could not delete book: ", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/edit/${book._id}`);
  };

  return (
    <article className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">
      <Link to={`/books/${book._id}`}>
        <div
          className="relative w-full bg-gray-100"
          style={{ height: "300px" }}
        >
          <img
            src={book.image || "/placeholder.png"}
            alt={book.title}
            className="w-full h-full object-contain absolute inset-0"
          />
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {book.description}
          </p>
          <div className="text-green-600 font-bold">
            {formatCurrency(book.price)}
          </div>
        </div>
      </Link>

      {isOwner && (
        <div className="p-3 border-t flex justify-end gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
          >
            <PenSquareIcon size={18} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          >
            {isDeleting ? "..." : <Trash2Icon size={18} />}
          </button>
        </div>
      )}
    </article>
  );
}
