import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("customerToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const loginCustomer = (data) => api.post("/auth/login", data);


export default api;


import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import CustomerProfile from "../../pages/profile/CustomerProfile.jsx";