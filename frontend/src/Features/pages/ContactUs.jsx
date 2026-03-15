import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ContactUs() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {t("contactUs")}
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("contactInformation")}
            </p>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">{t("emailUsAt")}</p>
                <a
                  href="mailto:zcbmq14@gmail.com"
                  className="text-blue-600 hover:underline font-medium"
                >
                  zcbmq14@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
