import { useTranslation } from "react-i18next";
import { BOOK_SECTIONS } from "../../constants/sections";

export default function SectionPicker({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      {BOOK_SECTIONS.map(({ value: v, labelKey }) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            value === v
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          {t(labelKey)}
        </button>
      ))}
    </div>
  );
}
