import { BookOpen, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import UserIcon from "../shared/UserIcon";
import LanguageSwitcher from "../shared/LanguageSwitcher";
import { useAuthStore } from "../../stores/authStore";
import { isAdminRole } from "../../lib/userId";

export default function Header() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  return (
    <header className="hero-gradient text-white shadow-xl shadow-emerald-900/20">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3 group min-w-0">
            <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/15 ring-1 ring-white/30 rounded-2xl flex items-center justify-center group-hover:bg-white/25 transition">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">
                Uni<span className="text-gradient">Store</span>
              </h1>
              <p className="text-xs sm:text-sm text-emerald-50/90 truncate">
                {t("tagline")}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {isAdminRole(user) && (
              <Link
                to="/admin"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-sm font-medium transition"
              >
                <Shield className="w-4 h-4" />
                {t("adminPanel")}
              </Link>
            )}
            <UserIcon />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
