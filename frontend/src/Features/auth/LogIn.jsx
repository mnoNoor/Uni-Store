import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, Loader } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useTranslation } from "react-i18next";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuthStore();

  const navigate = useNavigate();
  const { t } = useTranslation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      toast.success("Login successful!");
      navigate("/add-book");
    } catch (error) {
      toast.error(error.message || "Login failed!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            {t("logIn")}
          </h1>

          <form onSubmit={submitHandler} className="space-y-5">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {t("email")}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="email"
                  name="email"
                  placeholder="you@gmail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                {t("password")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/*
            <div className="text-right">
              <a
                href="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                {t("forgotPassword")}
              </a>
            </div>
          */}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg text-white font-medium ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" size={18} />
                  {t("loggingIn")}
                </>
              ) : (
                t("logIn")
              )}
            </button>

            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600">
                {t("dontHaveAccount")}{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                >
                  {t("signUpHere")}
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
