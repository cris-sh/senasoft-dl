import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ mustBeAuth = false }) {
    const { session, sessionState } = useAuth();

    if (sessionState === "loading") {
        // return <LoadingComponent/>
    }

    if (
        (mustBeAuth && sessionState !== "authenticated") ||
        (mustBeAuth && !session && sessionState === "unauthenticated")
    ) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
