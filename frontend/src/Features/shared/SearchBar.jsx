import { useTranslation } from "react-i18next";

export default function SearchBar({ query, setQuery, sortBy, setSortBy }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="w-full max-w-lg">
        <label
          htmlFor="search"
          className="block text-sm font-semibold text-gray-600 mb-1"
        >
          {t("searchBooks")}
        </label>

        <div className="relative">
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full pl-4 pr-10 py-2 rounded-md border focus:outline-none focus:ring focus:border-green-300"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:ml-4 m-2">
        <label htmlFor="sort" className="text-sm text-gray-600">
          {t("sortBy")}
        </label>

        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="py-2 px-3 border rounded-md bg-white w-full sm:w-auto"
        >
          <option value="newest">{t("newest")}</option>
          <option value="price-asc">{t("priceAsc")}</option>
          <option value="price-desc">{t("priceDesc")}</option>
        </select>
      </div>
    </div>
  );
}
