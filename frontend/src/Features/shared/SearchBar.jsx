import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { BOOK_SECTIONS } from "../../constants/sections";

export default function SearchBar({
  query,
  setQuery,
  sortBy,
  setSortBy,
  section,
  setSection,
}) {
  const { t } = useTranslation();

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 shadow-sm space-y-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            {t("searchBooks")}
          </label>
          <div className="relative">
            <Search className="absolute inset-s-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full ps-10 pe-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 sm:min-w-35">
            <label htmlFor="sort" className="block text-sm text-slate-600 mb-1">
              {t("sortBy")}
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500/40"
            >
              <option value="newest">{t("newest")}</option>
              <option value="price-asc">{t("priceAsc")}</option>
              <option value="price-desc">{t("priceDesc")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <span className="block text-sm font-semibold text-slate-700 mb-1.5">
            {t("section")}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSection("")}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                !section
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {t("allSections")}
            </button>
            {BOOK_SECTIONS.map(({ value, labelKey }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSection(value)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  section === value
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
