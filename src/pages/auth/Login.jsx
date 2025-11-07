import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import api from "../../api/axiosConfig.js";

export default function CustomerLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("customerToken");
        if (token) navigate("/dashboard"); // Change this to your customer dashboard route
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/login", { email, password });
            const user = res.data.user;

            // Only allow customers
            if (user.role !== "user") {
                setError("Access denied. Only customers can log in here.");
                return;
            }

            // Save token & user info
            localStorage.setItem("customerToken", res.data.token);
            localStorage.setItem("customer", JSON.stringify(user));

            // Navigate to customer dashboard
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/airport-bg.jpg')" }}>
            <div className="absolute inset-0 bg-black/60"></div>

            <div className="relative z-10 backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20 mx-4">
                <h2 className="text-3xl font-bold text-white text-center mb-6">Customer Login</h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm text-white mb-1">Email</label>
                        <div className="flex items-center border border-white/50 rounded-lg px-3 py-2 bg-white/10">
                            <Mail size={18} className="text-gray-200" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="customer@example.com"
                                className="ml-2 w-full bg-transparent text-white outline-none"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-white mb-1">Password</label>
                        <div className="relative flex items-center border border-white/50 rounded-lg px-3 py-2 bg-white/10">
                            <Lock size={18} className="text-gray-200" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="ml-2 w-full bg-transparent text-white outline-none pr-10"
                                required
                            />
                            <span className="absolute right-3 cursor-pointer text-gray-300" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </span>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-red-300 text-sm text-center bg-white/10 rounded-md py-1">
                            {error}
                        </p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-500/80 hover:bg-indigo-600 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                {/* Info / Optional */}
                <p className="text-center text-sm text-gray-200 mt-5">
                    Don’t have an account?{" "}
                    <span className="text-white font-medium cursor-pointer hover:underline">
                        Contact admin
                    </span>
                </p>
            </div>
        </div>
    );
}
