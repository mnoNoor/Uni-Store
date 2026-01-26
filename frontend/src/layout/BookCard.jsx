import { PenSquareIcon, Trash2Icon } from "lucide-react";
import instance from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import EditPage from "../pages/EditPage";

export default function ProductCard({ book, setBooks }) {
  const navigate = useNavigate();
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      await instance.delete(`/books/${book._id}`);
      toast.success("Book deleted successfully");
      setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  const handelEdit = (e) => {
    e.preventDefault();
    navigate(`/edit/${book._id}`);
  };
  return (
    <Link to={`/books/${book._id}`}>
      <div className="border rounded-lg p-4 shadow-md bg-white">
        <img
          src={book.image}
          alt={book.title}
          className="w-full h-48 object-cover mb-4 rounded"
        />
        <h2 className="text-xl font-bold mb-2">{book.title}</h2>
        <p className="text-gray-700 mb-2">{book.description}</p>
        <p className="text-green-600 font-semibold mb-4">${book.price}</p>
        <div className="flex justify-end space-x-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={handelEdit}
          >
            <PenSquareIcon />
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={handleDelete}
          >
            <Trash2Icon />
          </button>
        </div>
      </div>
    </Link>
  );
}
