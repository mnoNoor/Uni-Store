import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import instance from "../lib/axios";

export default function UserIcon() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/auth/user-auth");
        setUser(res.data.user);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  if (!user) {
    return <div className="w-10 h-10 bg-white/20 rounded-full animate-pulse" />;
  }

  return (
    <Link to="/user">
      <div className="flex items-center space-x-3 cursor-pointer group">
        <img
          src={user.image || "/avatar.png"}
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
