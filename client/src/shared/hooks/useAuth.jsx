import { useContext } from "react";

// context
import { AuthContext } from "../context/AuthenticationContext";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
