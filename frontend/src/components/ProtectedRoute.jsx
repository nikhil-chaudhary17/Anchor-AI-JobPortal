import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function ProtectedRoute({ allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === "candidate") {
            return <Navigate to="/candidate/dashboard" replace />;
        }

        if (user.role === "recruiter") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        if (user.role === "admin") {
            return <Navigate to="/admin/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}