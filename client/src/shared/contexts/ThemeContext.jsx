import React, { createContext, useEffect, useState } from "react";

// hooks
import { useAuth } from "../hooks/useAuth";
import { fetchApiData } from "../hooks/useApi";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    const { session, reload } = useAuth();

    const userTheme = session?.preferences?.theme || localStorage.getItem("user_theme") || "light";
    console.log("🎨 ThemeContext: User theme determined as", userTheme, "from session:", session?.preferences?.theme, "or localStorage:", localStorage.getItem("user_theme"));

    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(userTheme);

    // Update theme when session changes (e.g., after login)
    useEffect(() => {
        const newUserTheme = session?.preferences?.theme || localStorage.getItem("user_theme") || "light";
        console.log("🎨 ThemeContext: Session changed, updating theme to", newUserTheme);
        setTheme(newUserTheme);
    }, [session]);

    useEffect(() => {
        const $root = document.documentElement;
        
        $root.setAttribute("data-theme", theme);
        localStorage.setItem("user_theme", theme);
    }, [theme]);

    const toggleTheme = async () => {
        if (loading) return;
        console.log("🎨 ThemeContext: Toggling theme from", theme);

        const newTheme = theme === "light" ? "dark" : "light";
        const oldTheme = theme;

        setTheme(newTheme);
        setLoading(true);

        try {
            if (session?.id) {
                console.log("🎨 ThemeContext: Updating theme preference for user", session.id);
                const response = await fetchApiData("PUT", `preferences/${session.id}`, { theme: newTheme });
                console.log("🎨 ThemeContext: Theme update response", response);
            }
            console.log("🎨 ThemeContext: Reloading session");
            reload();
        } catch (error) {
            console.error("❌ ThemeContext: Error updating theme", error);
            setTheme(oldTheme);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        theme,
        toggleTheme,
        loading,
    };
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
