import { useEffect, useState } from "react";
import { Loader, Trash2, KeyRound, UserPlus, Users, BookOpen, Package } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import instance from "../../lib/axios";
import { useAuthStore } from "../../stores/authStore";
import ProtectedRoute from "../shared/ProtectedRoute";
import { isSuperAdmin } from "../../lib/userId";

function AdminPanel() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [promoteEmail, setPromoteEmail] = useState("");
  const [passwordUserId, setPasswordUserId] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, booksRes] = await Promise.all([
        instance.get("/admin/stats"),
        instance.get("/admin/users"),
        instance.get("/admin/books"),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBooks(booksRes.data);
    } catch {
      toast.error(t("adminLoadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const deleteUser = async (id) => {
    if (!confirm(t("confirmDeleteUser"))) return;
    try {
      await instance.delete(`/admin/users/${id}`);
      toast.success(t("userDeleted"));
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t("adminActionError"));
    }
  };

  const deleteBook = async (id) => {
    if (!confirm(t("confirmDelete"))) return;
    try {
      await instance.delete(`/admin/books/${id}`);
      toast.success(t("bookDeleted"));
      load();
    } catch {
      toast.error(t("adminActionError"));
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (!passwordUserId || !newAdminPassword) return;
    try {
      await instance.patch(`/admin/users/${passwordUserId}/password`, {
        password: newAdminPassword,
      });
      toast.success(t("passwordResetSuccess"));
      setNewAdminPassword("");
      setPasswordUserId("");
    } catch (err) {
      toast.error(err.response?.data?.message || t("adminActionError"));
    }
  };

  const promoteAdmin = async (e) => {
    e.preventDefault();
    try {
      await instance.post("/admin/admins", { email: promoteEmail });
      toast.success(t("adminPromoted"));
      setPromoteEmail("");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || t("adminActionError"));
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center py-24">
        <Loader className="animate-spin text-emerald-600" size={40} />
      </div>
    );
  }

  const statCards = [
    { label: t("statUsers"), value: stats?.usersCount, icon: Users, color: "bg-blue-500" },
    { label: t("statBooks"), value: stats?.booksCount, icon: BookOpen, color: "bg-emerald-500" },
    { label: t("statActive"), value: stats?.activeListings, icon: Package, color: "bg-teal-500" },
    { label: t("statSold"), value: stats?.soldCount, icon: Package, color: "bg-amber-500" },
  ];

  return (
    <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t("adminPanel")}</h1>
      <p className="text-slate-500 mb-8">{t("adminWelcome", { name: user?.username })}</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card rounded-2xl p-5 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${color} text-white flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{value ?? 0}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {isSuperAdmin(user) && (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            {t("addAdmin")}
          </h2>
          <form onSubmit={promoteAdmin} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={promoteEmail}
              onChange={(e) => setPromoteEmail(e.target.value)}
              placeholder={t("adminEmailPlaceholder")}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200"
              required
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
            >
              {t("promoteToAdmin")}
            </button>
          </form>
        </div>
      )}

      <div className="glass-card rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-amber-600" />
          {t("resetUserPassword")}
        </h2>
        <form onSubmit={resetPassword} className="grid sm:grid-cols-3 gap-3">
          <select
            value={passwordUserId}
            onChange={(e) => setPasswordUserId(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-slate-200"
            required
          >
            <option value="">{t("selectUser")}</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.username} ({u.email})
              </option>
            ))}
          </select>
          <input
            type="password"
            value={newAdminPassword}
            onChange={(e) => setNewAdminPassword(e.target.value)}
            placeholder={t("newPassword")}
            minLength={8}
            className="px-4 py-2.5 rounded-xl border border-slate-200"
            required
          />
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600"
          >
            {t("resetPassword")}
          </button>
        </form>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">{t("manageUsers")}</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-start text-slate-500 border-b">
                  <th className="py-2 pe-2">{t("username")}</th>
                  <th className="py-2 pe-2">{t("role")}</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-slate-100">
                    <td className="py-3 pe-2">
                      <div className="font-medium">{u.username}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3 pe-2 capitalize">{u.role}</td>
                    <td className="py-3 text-end">
                      {u.role !== "superadmin" && u._id !== user?._id && (
                        <button
                          type="button"
                          onClick={() => deleteUser(u._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 overflow-hidden">
          <h2 className="text-lg font-bold mb-4">{t("manageBooks")}</h2>
          <div className="overflow-x-auto max-h-96 overflow-y-auto space-y-2">
            {books.map((b) => (
              <div
                key={b._id}
                className="flex items-center justify-between gap-2 p-3 rounded-xl bg-slate-50"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">{b.title}</p>
                  <p className="text-xs text-slate-500">
                    @{b.owner?.username} · {b.sold ? t("soldBadge") : "⃁" + b.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBook(b._id)}
                  className="shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute adminOnly>
      <AdminPanel />
    </ProtectedRoute>
  );
}
