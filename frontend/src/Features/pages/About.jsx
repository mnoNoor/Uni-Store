import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-green-600 mb-6">
              {t("about")}
            </h1>

            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">{t("welcomeToUPM")}</p>

              <p className="leading-relaxed">{t("ourMission")}</p>

              <div className="border-t border-gray-200 my-6"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
