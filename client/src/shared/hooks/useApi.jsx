import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

async function apiFetch(endpoint, method = "get", body = null) {
    try {
        const token = localStorage.getItem("auth_token");
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
        const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return { success: false, message: "Error: " + error.message };
    }
}

export function useGetData(endpoint) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(0);
    const location = useLocation();
    useEffect(() => {
        if (!endpoint) return;
        (async () => {
            const response = await apiFetch(endpoint);
            if (response?.success) setData(response);
            setLoading(false);
        })();
    }, [trigger, endpoint, location.pathname]);
    const reload = () => setTrigger((prev) => prev + 1);
    return { data: data?.data, total: data?.total, loading, reload };
}

export async function fetchApiData(method, endpoint, body, notify = true) {
    const response = await apiFetch(endpoint, method, body);
    if (notify) {
        if (response.success) toast.success(response.message);
        else toast.error(response.message);
    }
    return response;
}
