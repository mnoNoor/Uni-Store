import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../stores/authStore";
import { isAdminRole } from "../../lib/userId";

export default function NavBar() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const links = [
    { to: "/", label: t("home") },
    { to: "/about", label: t("about") },
    { to: "/contact", label: t("contact") },
  ];

  if (isAdminRole(user)) {
    links.push({ to: "/admin", label: t("adminPanel") });
  }

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
      <div className="container mx-auto px-4">
        <ul className="flex gap-1 justify-center py-2 overflow-x-auto">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
