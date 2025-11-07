import React, { useState, useEffect, useRef } from "react";
import { Bell, Settings, UserCircle, LogOut, ChevronDown } from "lucide-react";
import logoGif from "../assets/output-onlinegiftools.gif";
import { useNavigate } from "react-router-dom";


export default function Header({ onProfileClick }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user, setUser] = useState({ name: "Loading..." });
    const [notifications] = useState(3);
    const profileRef = useRef(null);
    const navigate = useNavigate();


    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("customer"));
        if (storedUser) setUser(storedUser);
        else setUser({ name: "Guest" });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const initials = user.name
        ? user.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "CU";

    return (
        <header className="backdrop-blur-md bg-white/70 shadow-lg rounded-2xl sticky top-2 z-50 mx-4 border border-[#be965b]/40">
            <div className="w-full px-6 py-3">
                <div className="flex items-center justify-between w-full">
                    {/* Left: Logo */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-gradient-to-br ">
                            <img
                                src={logoGif}
                                alt="FTS Aero Logo"
                                className="h-7 w-auto object-contain"
                            />
                        </div>
                    </div>

                    {/* Right: Icons + Profile */}
                    <div className="flex items-center gap-2" ref={profileRef}>
                        {/* Notifications */}
                        <button className="relative p-2.5 !hover:bg-[#BE965B]/10 rounded-xl transition-all duration-200 group !border-[#BE965B] outline-1">
                            <Bell size={20} className="text-[#1C2554] group-hover:text-[#BE965B] transition-colors" />
                            {notifications > 0 && (
                                <span className="absolute top-1 right-1 bg-gradient-to-br from-[#BE965B] to-[#1C2554] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white shadow-lg">
                                    {notifications}
                                </span>
                            )}
                        </button>

                        {/* Settings */}
                        <button className="p-2.5 hover:bg-[#BE965B]/10 rounded-xl transition-all duration-200 group !border-[#BE965B] outline-1">
                            <Settings size={20} className="text-[#1C2554] group-hover:text-[#BE965B] group-hover:rotate-90 transition-all duration-300" />
                        </button>

                        {/* Divider */}
                        <div className="h-8 w-px bg-[#BE965B]/100 mx-5"></div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center gap-2.5 px-3 py-2 bg-white/40 border !border-[#BE965B]/70 outline-1 rounded-xl hover:shadow-md transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#1C2554] to-[#BE965B] shadow-sm group-hover:shadow-md transition-shadow">
                                    {initials}
                                </div>
                                <span className="text-sm font-semibold text-[#1C2554] max-w-[120px] truncate">
                                    {user.name}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className={`text-[#1C2554]/70 transition-transform duration-200 ${
                                        showProfileMenu ? "rotate-180" : ""
                                    }`}
                                />
                            </button>

                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border border-[#BE965B]/50 overflow-hidden z-50">
                                    <div className="px-4 py-3 border-b border-[#BE965B]/30">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br from-[#1C2554] to-[#BE965B] shadow-sm">
                                                {initials}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-[#1C2554] truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Logged in as <span className="text-[#1C2554] font-medium">{user.name}</span>
                                                </p>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2">
                                        <button
                                            onClick={() => {
                                                onProfileClick();
                                                setShowProfileMenu(false);
                                            }}
                                            className="w-full px-3 py-2.5 text-left hover:bg-[#BE965B]/10 flex items-center mb-2 text-[#1C2554] text-sm transition-colors group rounded-lg"
                                        >
                                            <UserCircle
                                                size={18}
                                                className="text-[#1C2554]/60 group-hover:text-[#BE965B] transition-colors flex-shrink-0 mr-3 "
                                            />
                                            <span className="group-hover:text-[#1C2554] font-medium">
                                                Manage Profile
                                            </span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                localStorage.removeItem("customer");
                                                localStorage.removeItem("customerToken");
                                                navigate("/login", { replace: true }); // 👈 redirect via React Router
                                            }}
                                            className="w-full px-3 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-[#1C2554] text-sm transition-colors group rounded-lg"
                                        >
                                            <LogOut
                                                size={18}
                                                className="text-[#1C2554]/60 group-hover:text-red-500 transition-colors flex-shrink-0"
                                            />
                                            <span className="group-hover:text-red-600 font-medium">
        Logout
    </span>
                                        </button>

                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
