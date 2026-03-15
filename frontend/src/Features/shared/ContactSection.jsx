import { MessageCircle, Send } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactSection({ whatsapp, telegram, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      <h3 className="font-semibold text-gray-700">{t("contactInformation")}</h3>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {t("whatsAppLabel")}
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <MessageCircle className="w-4 h-4" />
          </span>

          <input
            type="text"
            placeholder="050xxxxxxx"
            value={whatsapp || ""}
            onChange={(e) => onChange("whatsapp", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-green-500
                       focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">
          {t("telegramLabel")}
        </label>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <Send className="w-4 h-4" />
          </span>

          <input
            type="text"
            placeholder="@username"
            value={telegram || ""}
            onChange={(e) => onChange("telegram", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       focus:border-transparent transition-all"
          />
        </div>
      </div>
    </div>
  );
}
