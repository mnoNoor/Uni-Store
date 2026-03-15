import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

import UserIcon from "../shared/UserIcon";
import LanguageSwitcher from "../shared/LanguageSwitcher";

export default function Header() {
  return (
    <header className="bg-linear-to-r from-emerald-600 to-teal-500 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center text-lg sm:text-xl font-bold group-hover:bg-white/30 transition-all transform group-hover:scale-105">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                Uni<span className="text-yellow-300">Store</span>
              </h1>
              <p className="text-xs sm:text-sm opacity-90 font-medium">
                University Books Marketplace
              </p>
            </div>
          </Link>
          <div className="flex items-center space-x-3">
            <UserIcon />
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
