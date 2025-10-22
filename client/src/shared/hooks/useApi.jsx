import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

async function apiFetch(endpoint, method = "get", body = null) {
    try {
        const token = localStorage.getItem("auth_token");
        console.log("🔑 Token:", token ? "Present" : "Not found");
        const options = {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        };
        if (body && !(body instanceof FormData)) {
            options.headers["Content-Type"] = "application/json";
            const replacer = (key, value) => value ?? "";
            options.body = JSON.stringify(body, replacer);
        } else if (body && body instanceof FormData) {
            options.body = body;
        }
        console.log("📡 API Request:", method.toUpperCase(), `${import.meta.env.VITE_API_URL}${endpoint}`);
        console.log("📦 Body:", body);
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);
        console.log("📥 Response Status:", response.status);
        const data = await response.json();
        console.log("📄 Response Data:", data);
        return data;
    } catch (error) {
        console.error("❌ API Error:", error);
        return { message: "error", data: null, status: 500 };
    }
}

export function useGetData(endpoint) {
    const [data, setData] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);
    const location = useLocation();
    useEffect(() => {
        if (!endpoint) return;
        console.log("🔄 useGetData: Fetching", endpoint);
        (async () => {
            const response = await apiFetch(endpoint);
            console.log("📊 useGetData Response:", response);
            if (response?.message === "ok") {
                setData(response.data);
                setMessage(response.message);
                console.log("✅ useGetData: Data loaded successfully", response.data);
            } else {
                console.log("⚠️ useGetData: Response not ok", response);
            }
            setLoading(false);
        })();
    }, [trigger, endpoint, location.pathname]);
    const reload = () => {
        console.log("🔄 useGetData: Reloading", endpoint);
        setTrigger((prev) => prev + 1);
    };
    return { data, message, loading, reload };
}

export async function fetchApiData(method, endpoint, body) {
    console.log("🚀 fetchApiData: Called with", { method, endpoint, body });
    const response = await apiFetch(endpoint, method, body);
    console.log("📤 fetchApiData: Response", response);
    return response;
}
