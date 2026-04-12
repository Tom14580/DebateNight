import { useState, useEffect } from "react";

export function useOnlineCount() {
    const [count, setCount] = useState(0);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchCount = async () => {
        try {
            const response = await fetch(`${API_URL}/api/online-count`);
            const data = await response.json();
            setCount(data.online);
        } catch (error) {
            console.error("Failed to fetch online count:", error);
        }
        };

        fetchCount();

        const interval = setInterval(fetchCount, 30000);
        return () => clearInterval(interval);
    }, [API_URL])

    return count;
}