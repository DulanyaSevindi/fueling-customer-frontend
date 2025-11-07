import axios from "axios";

// Set base URL from environment variable (Vite)
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", // fallback if env variable is missing
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to attach token
api.interceptors.request.use(
    (config) => {
        // Check for admin token first
        const token = localStorage.getItem("token") || localStorage.getItem("customerToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor (optional) for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // You can handle 401/403 globally here
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Redirecting to login...");
            // window.location.href = "/login"; // optional redirect
        }
        return Promise.reject(error);
    }
);

export default api;
