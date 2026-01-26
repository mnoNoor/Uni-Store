import { Link } from "react-router-dom";

export default function AddBookButton() {
  return (
    <Link to="/add-book" className="flex justify-end">
      <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded m-4">
        Add Book
      </button>
    </Link>
  );
}
