import instance from "../lib/axios";
import { useEffect, useState } from "react";

import Header from "../layout/Header";
import NavBar from "../layout/NavBar";
import Footer from "../layout/Footer";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await instance.get("/auth/user-auth");
        setUser(res.data.user);
        console.log("Fetched user data:", res.data.user);
      } catch (error) {
        console.log("fetchUser error.response:", error.response);
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
  return (
    <div>
      <Header />
      <NavBar />
      <div>
        {loading && !isRateLimited && <p>Loading user info...</p>}
        {isRateLimited && (
          <p>You are being rate limited. Please try again later.</p>
        )}
        {user && (
          <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-4">
              Welcome, {user.username}!
            </h2>
            <p className="text-lg">Email: {user.email}</p>
            <p className="text-lg">
              Member since: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
