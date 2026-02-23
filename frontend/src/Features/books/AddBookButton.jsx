import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function AddBookButton() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  const handleClick = () => {
    if (isLoading) return;

    if (!user) {
      navigate("/signup", { state: { from: "/add-book" } });
      return;
    }

    navigate("/add-book");
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Add book"
      title="Add Book"
      className="fixed right-6 bottom-6 z-50 bg-green-600 hover:bg-green-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition"
    >
      <span className="text-2xl font-bold">+</span>
    </button>
  );
}
