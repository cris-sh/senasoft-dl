import React, { createContext, useEffect, useState } from "react";

// hooks
import { useGetData } from "../hooks/useApi";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("auth_token"));
    const [sessionState, setSessionState] = useState("loading");

    const {
        data: session,
        loading: loadingSession,
        reload: reloadingSession,
    } = useGetData("auth/me");

    useEffect(() => {
        const storedToken = localStorage.getItem("auth_token");

        if (!storedToken) {
            setSessionState("unauthenticated");
            return;
        }

        if (loadingSession) {
            setSessionState("loading");
            return;
        }

        if (session) {
            setSessionState("authenticated");
        } else {
            setSessionState("unauthenticated");
        }
    }, [session, sessionState, loadingSession]);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem("auth_token", newToken);
        setSessionState("authenticated");
    };

    const logout = () => {
        localStorage.removeItem("auth_token");
        setToken(null);
        setSessionState("unauthenticated");
    };

    const value = {
        token,
        session,
        sessionState,
        reload: (reset = false) => reloadingSession(reset),
        login,
        logout,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
