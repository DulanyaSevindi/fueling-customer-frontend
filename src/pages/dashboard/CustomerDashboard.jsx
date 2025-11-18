import React, { useState } from "react";
import axios from "axios";
import { Truck, Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [searchCountry, setSearchCountry] = useState("");
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // default today
    });
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const user = JSON.parse(localStorage.getItem("customer") || "{}");

    // ✅ Use .env API URL
    const API_URL = import.meta.env.VITE_API_URL;

    const handleSearch = async () => {
        if (!searchCountry.trim()) return alert("Enter a country");

        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/supplier`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` },
            });

            const allSuppliers = response.data;
            let countrySuppliers = [];

            // Flatten all airports for searched country
            allSuppliers.forEach((supplier) => {
                supplier.countries?.forEach((country) => {
                    if (country.countryName?.toLowerCase() === searchCountry.toLowerCase()) {
                        country.airports?.forEach((airport) => {
                            airport.prices?.forEach((price) => {
                                if (selectedDate) {
                                    const selected = new Date(selectedDate);
                                    const from = new Date(price.validFrom);
                                    const to = price.validTo ? new Date(price.validTo) : null;

                                    // Include only if selected date is within range
                                    if (selected >= from && (!to || selected <= to)) {
                                        countrySuppliers.push({
                                            supplierName: supplier.supplierName,
                                            supplierId: supplier.id,
                                            status: supplier.status,
                                            country: country.countryName,
                                            airport: airport.airportName,
                                            baseFare: price.baseFare,
                                            validFrom: price.validFrom,
                                            validTo: price.validTo,
                                        });
                                    }
                                } else {
                                    // If no date filter, include all
                                    countrySuppliers.push({
                                        supplierName: supplier.supplierName,
                                        supplierId: supplier.id,
                                        status: supplier.status,
                                        country: country.countryName,
                                        airport: airport.airportName,
                                        baseFare: price.baseFare,
                                        validFrom: price.validFrom,
                                        validTo: price.validTo,
                                    });
                                }
                            });
                        });
                    }
                });
            });

            // Normal customers see only the cheapest airport
            if (!user?.canViewAllSuppliers && countrySuppliers.length > 0) {
                const cheapest = countrySuppliers.reduce((min, curr) =>
                    curr.baseFare < min.baseFare ? curr : min
                );
                countrySuppliers = [cheapest];
            }

            setSuppliers(countrySuppliers);
            setShowResults(true);
        } catch (err) {
            console.error("Error fetching suppliers:", err);
            alert("Failed to fetch suppliers");
        } finally {
            setLoading(false);
        }
    };

    const handleCloseResults = () => {
        setShowResults(false);
        setSuppliers([]);
        setSearchCountry("");
    };

    return (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C2554] to-[#BE965B]">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <div
                    className="relative h-[500px] bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000')",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1C2554]/80 to-[#BE965B]/50"></div>
                    <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
                        <img
                            src="https://ftsaero.com/wp-content/uploads/2023/06/fts-logo-gold-white.png"
                            alt="FTS Logo"
                            className="w-48 mb-8 drop-shadow-xl"
                        />

                        <h1 className="text-5xl font-bold text-white mb-4 text-center max-w-4xl">
                            Discover Reliable Aviation Suppliers
                        </h1>
                        <p className="text-xl text-white/90 mb-12 text-center max-w-3xl">
                            Find and connect with trusted suppliers worldwide
                        </p>

                        {/* Search Box */}
                        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl p-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Country Input */}
                                <div className="w-full">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchCountry}
                                            onChange={(e) => setSearchCountry(e.target.value)}
                                            placeholder="e.g., Sri Lanka"
                                            className="w-full pl-12 pr-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C2554] focus:border-[#1C2554] transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Date Input */}
                                <div className="w-full">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-4 py-3.5 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C2554] focus:border-[#1C2554] transition-all outline-none"
                                    />
                                </div>

                                {/* Search Button */}
                                <div className="w-full flex items-end">
                                    <button
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="w-full bg-gradient-to-r from-[#1C2554] to-[#BE965B] hover:from-[#BE965B] hover:to-[#1C2554] disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Searching...
                                            </>
                                        ) : (
                                            <>
                                                <Search size={20} />
                                                Search
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {showResults && (
                    <div className="max-w-7xl mx-auto px-6 py-16 min-h-[300px]">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-4xl font-bold text-gray-900 mb-1">Available Suppliers</h2>
                                <p className="text-xl text-gray-600">
                                    {suppliers.length} {user?.canViewAllSuppliers ? "result(s)" : "cheapest option"} found
                                </p>
                                {!user?.canViewAllSuppliers && suppliers.length > 0 && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Showing the cheapest airport option in {searchCountry}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleCloseResults}
                                className="text-white hover:text-gray-700 !bg-black hover:bg-gray-200 font-semibold transition-colors px-4 py-2 rounded-lg"
                            >
                                ✕ Close
                            </button>
                        </div>

                        {suppliers.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {suppliers.map((supplier, idx) => (
                                    <div
                                        key={idx}
                                        className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-[#BE965B] transform hover:-translate-y-2"
                                    >
                                        <div className="h-2 bg-gradient-to-r from-[#1C2554] to-[#BE965B]"></div>
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-gradient-to-br from-[#1C2554] to-[#BE965B] p-3 rounded-lg shadow-md">
                                                        <Truck className="text-white" size={24} />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-[#1C2554] group-hover:text-[#BE965B] transition-colors">
                                                            {supplier.supplierName}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                    supplier.status === "active"
                                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                                        : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                                        supplier.status === "active" ? 'bg-green-500' : 'bg-red-500'
                                                    }`}></span>
                                                    {supplier.status === "active" ? 'Available' : 'Unavailable'}
                                                </span>

                                                {!user?.canViewAllSuppliers && (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 ml-2">
                                                        💰 Cheapest in Country
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                <MapPin size={18} className="text-[#BE965B]" />
                                                <span className="text-sm font-medium">
                                                    {supplier.country} - {supplier.airport}
                                                </span>
                                            </div>

                                            <div className="mb-2">
                                                <span className="text-gray-800 font-semibold">
                                                    Base Price: ${supplier.baseFare}
                                                </span>
                                            </div>

                                            {/* Validity Range */}
                                            <div className="text-xs text-gray-500 mt-2">
                                                <p>Valid From: {supplier.validFrom ? new Date(supplier.validFrom).toLocaleDateString() : "-"}</p>
                                                <p>Valid To: {supplier.validTo ? new Date(supplier.validTo).toLocaleDateString() : "-"}</p>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/request-fuel/${supplier.supplierId}`, {
                                                        state: { customerId: user.id }   // <-- Pass Customer ID
                                                    })
                                                }
                                                className="w-full mt-4 bg-gradient-to-r from-[#1C2554] to-[#BE965B] hover:from-[#BE965B] hover:to-[#1C2554] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform group-hover:scale-105 flex items-center justify-center gap-2"
                                            >
                                                <span>Request Fuel</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth={2}
                                                    stroke="currentColor"
                                                    className="w-5 h-5"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12l-3.75 3.75M3 12h18" />
                                                </svg>
                                            </button>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32">
                                <p className="text-2xl text-gray-600">No suppliers found for your search criteria.</p>
                                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}