import { Navigate, useLocation } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  if (isCheckingAuth) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader className="animate-spin text-emerald-600" size={36} />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (adminOnly && !["admin", "superadmin"].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
