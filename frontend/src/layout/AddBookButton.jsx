import { Link } from "react-router-dom";

export default function AddBookButton() {
  return (
    <Link to="/add-book" aria-label="Add book">
      <button
        className="fixed right-6 bottom-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition"
        title="Add Book"
      >
        <span className="text-2xl font-bold">+</span>
      </button>
    </Link>
  );
}
