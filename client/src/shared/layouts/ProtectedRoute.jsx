import { Navigate, Outlet } from "react-router-dom";

// hooks
import { useAuth } from "../hooks/useAuth";

// components
import LoadingComponent from "../components/LoadingComponent";

export default function ProtectedRoute({ mustBeAuth = false }) {
    const { session, sessionState } = useAuth();

    if (sessionState === "loading") {
        return <LoadingComponent size={100} />;
    }

    if (
        (mustBeAuth && sessionState !== "authenticated") ||
        (mustBeAuth && !session && sessionState === "unauthenticated")
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
