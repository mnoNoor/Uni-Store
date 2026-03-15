import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "ar" ? "en" : "ar";
    i18n.changeLanguage(newLang);
  };

  const currentLang = i18n.language === "ar" ? "العربية" : "English";

  return (
    <button
      onClick={toggleLanguage}
      className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-600"
    >
      <Globe className="w-6 h-6" />

      <span className="text-xs mt-1">{currentLang}</span>
    </button>
  );
}
