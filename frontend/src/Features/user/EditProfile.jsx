import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import instance from "../../lib/axios";
import { useAuthStore } from "../../stores/authStore";
import ProtectedRoute from "../shared/ProtectedRoute";

function EditProfileForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { username, email };
      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }
      const res = await instance.put("/auth/profile", body);
      setUser(res.data.user);
      toast.success(t("profileUpdated"));
      navigate("/user");
    } catch (err) {
      toast.error(err.response?.data?.message || t("errorUpdatingProfile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-lg">
      <Link
        to="/user"
        className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
      >
        <ArrowLeftIcon className="h-4 w-4 me-1" />
        {t("backToProfile")}
      </Link>

      <div className="glass-card rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{t("editProfile")}</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("username")}
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
              required
              minLength={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
              required
            />
          </div>

          <hr className="border-slate-200" />
          <p className="text-sm text-slate-500">{t("changePasswordOptional")}</p>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("currentPassword")}
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("newPassword")}
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {saving && <Loader className="animate-spin" size={18} />}
            {saving ? t("updating") : t("saveProfile")}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function EditProfile() {
  return (
    <ProtectedRoute>
      <EditProfileForm />
    </ProtectedRoute>
  );
}
