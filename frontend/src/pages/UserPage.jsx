import instance from "../lib/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../layout/Header";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";
import UserBooks from "../layout/UserBooks";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/auth/user-auth");
        setUser(res.data.user);
      } catch (error) {
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          console.error("Error fetching user:", error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogOut = async () => {
    try {
      await instance.post("auth/logout");
      navigate("/");
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <NavBar />

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        {loading && !isRateLimited && (
          <div className="text-lg font-semibold animate-pulse text-gray-700">
            Loading user info...
          </div>
        )}

        {isRateLimited && (
          <div className="bg-red-100 text-red-600 px-6 py-4 rounded-lg shadow">
            You are being rate limited. Please try again later.
          </div>
        )}

        {user && (
          <div>
            <div className="bg-white/70 backdrop-blur-md p-8 w-full max-w-md text-center transition hover:scale-105 duration-300">
              <div className="flex justify-center mb-6">
                <img
                  src={user.image}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {user.username}
              </h1>

              <p className="text-gray-500 text-sm">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <div className="mt-6 flex justify-center gap-4">
                <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow transition">
                  Edit Profile
                </button>
                <button
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg shadow transition"
                  onClick={handleLogOut}
                >
                  Logout
                </button>
              </div>
            </div>
            <div>
              <UserBooks />
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
