import React, { useState } from "react";
import axios from "axios";
import { Truck, Search, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const [searchCountry, setSearchCountry] = useState("");
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
                                countrySuppliers.push({
                                    supplierName: supplier.supplierName,
                                    supplierId: supplier.id,
                                    status: supplier.status,
                                    country: country.countryName,
                                    airport: airport.airportName,
                                    baseFare: price.baseFare,
                                });
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
                        <div className="w-full max-w-6xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative">
                            <div className="absolute inset-0 bg-white/90 rounded-2xl"></div>
                            <div className="relative z-10 grid md:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            value={searchCountry}
                                            onChange={(e) => setSearchCountry(e.target.value)}
                                            placeholder="Enter country"
                                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={handleSearch}
                                        className="w-full bg-gradient-to-r from-[#1C2554] to-[#BE965B] hover:from-blue-950 hover:to-blue-950 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                                    >
                                        {loading ? "Searching..." : <><Search size={20} /> Search</>}
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
                                className="text-white !hover:text-gray-700 !bg-black font-semibold transition-colors px-3 py-1 rounded"
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

                                            <div className="mb-4">
                                                <span className="text-gray-800 font-semibold">
                                                    Base Price: ${supplier.baseFare}
                                                </span>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    navigate(`/supplier/${supplier.supplierId}?country=${encodeURIComponent(supplier.country)}&airport=${encodeURIComponent(supplier.airport)}`)
                                                }
                                                className="w-full bg-gradient-to-r from-[#1C2554] to-[#BE965B] hover:from-[#BE965B] hover:to-[#1C2554] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform group-hover:scale-105"
                                            >
                                                View Details
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
