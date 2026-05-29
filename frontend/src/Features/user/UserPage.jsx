import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import UserBooks from "./UserBooks";
import { Loader, LogOut, Edit, Calendar, Mail, Shield } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";
import { isAdminRole } from "../../lib/userId";
import ProtectedRoute from "../shared/ProtectedRoute";

function UserProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setLoggingOut(true);
    try {
      await logout();
      toast.success(t("loggedOut"));
      navigate("/");
    } catch {
      toast.error(t("errorLoggingOut"));
      setLoggingOut(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
      <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={user.image || "/avatar.webp"}
            alt={user.username}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-emerald-100 shadow mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.username}</h1>
          {user.role !== "user" && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 mb-2 capitalize">
              <Shield className="w-3 h-3" />
              {user.role}
            </span>
          )}
          {user.email && (
            <div className="flex items-center text-slate-600 mb-2">
              <Mail size={16} className="me-1" />
              <span className="text-sm">{user.email}</span>
            </div>
          )}
          <div className="flex items-center text-slate-500 text-sm mb-6">
            <Calendar size={14} className="me-1" />
            <span>
              {t("joined")} {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => navigate("/edit-profile")}
              className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition font-medium"
            >
              <Edit size={16} />
              {t("editProfile")}
            </button>
            {isAdminRole(user) && (
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="flex items-center gap-2 bg-slate-800 text-white px-5 py-2.5 rounded-xl hover:bg-slate-900 transition font-medium"
              >
                <Shield size={16} />
                {t("adminPanel")}
              </button>
            )}
            <button
              type="button"
              onClick={handleLogOut}
              disabled={loggingOut}
              className="flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl hover:bg-slate-200 transition disabled:opacity-50 font-medium"
            >
              {loggingOut ? <Loader className="animate-spin" size={16} /> : <LogOut size={16} />}
              {t("logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">{t("myBooks")}</h2>
        <UserBooks />
      </div>
    </div>
  );
}

export default function UserPage() {
  return (
    <ProtectedRoute>
      <UserProfile />
    </ProtectedRoute>
  );
}
