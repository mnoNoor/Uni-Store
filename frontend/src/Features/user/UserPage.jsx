import { useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import UserBooks from "./UserBooks";
import { Loader, LogOut, Edit, Calendar, Mail } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";

export default function UserPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, isCheckingAuth, navigate]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (!user) return null;

  const handleLogOut = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success(t("loggedOutSuccessfully"));
      navigate("/");
    } catch {
      toast.error(t("failedToLogout"));
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Toaster position="top-right" />

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col items-center">
              <img
                src={user.image || "/avatar.webp"}
                alt={user.username}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow mb-4"
              />

              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {user.username}
              </h1>

              {user.email && (
                <div className="flex items-center text-gray-600 mb-2">
                  <Mail size={16} className="mr-1" />
                  <span className="text-sm">{user.email}</span>
                </div>
              )}

              <div className="flex items-center text-gray-500 text-sm mb-4">
                <Calendar size={14} className="mr-1" />
                <span>
                  {t("joined")} {new Date(user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
                >
                  <Edit size={16} />
                  {t("editProfile")}
                </button>

                <button
                  onClick={handleLogOut}
                  disabled={loggingOut}
                  className="flex items-center gap-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {loggingOut ? (
                    <Loader className="animate-spin" size={16} />
                  ) : (
                    <>
                      <LogOut size={16} />
                      {t("logout")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t("myBooks")}
            </h2>
            <UserBooks />
          </div>
        </div>
      </div>
    </div>
  );
}
