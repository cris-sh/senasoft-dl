import React, { createContext, useEffect, useState } from "react";

// hooks
import { useAuth } from "../hooks/useAuth";
import { fetchApiData } from "../hooks/useApi";

const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
    const { session, reload } = useAuth();

    const userTheme = session?.preferences?.theme || localStorage.getItem("user_theme") || "light";

    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState(userTheme);

    useEffect(() => {
        const $root = document.documentElement;
        $root.setAttribute("data-theme", theme);
        localStorage.setItem("user_theme", theme);
    }, [theme]);

    const toggleTheme = async () => {
        if (loading) return;

        const newTheme = theme === "light" ? "dark" : "light";
        const oldTheme = theme;

        setTheme(newTheme);
        setLoading(false);

        try {
            if (session?.id) {
                await fetchApiData("PUT", `preferences/${session?.id}`, { theme });
            }
            reload();
        } catch (error) {
            setTheme(oldTheme);
            console.error(error);
        }
    };

    const value = {
        theme,
        toggleTheme,
        loading,
    };
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
