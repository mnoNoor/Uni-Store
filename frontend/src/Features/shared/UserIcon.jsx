import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

export default function UserIcon() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />;
  }

  if (!user) return null;

  return (
    <Link to="/user">
      <div className="flex items-center space-x-3 cursor-pointer group">
        <img
          src={user.image || "/avatar.webp"}
          alt="user"
          className="w-10 h-10 rounded-full object-cover border-2 border-white/70 transition group-hover:scale-105"
        />
        <span className="hidden md:block font-medium group-hover:underline">
          {user.username}
        </span>
      </div>
    </Link>
  );
}
