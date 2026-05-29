import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="mt-auto bg-slate-900 text-slate-300 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {t("footerText")}
        </p>
      </div>
    </footer>
  );
}
