import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header.jsx";
import Footer from "../../components/Footer.jsx";
import { MapPin, User } from "lucide-react";

export default function ViewDetails() {
    const { supplierId } = useParams();
    const [searchParams] = useSearchParams();
    const countryName = searchParams.get("country");
    const navigate = useNavigate();

    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplierDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/supplier/${supplierId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("customerToken")}`,
                    },
                });

                // Filter country data
                const countryData = response.data.countries.find(
                    (c) => c.countryName.toLowerCase().trim() === countryName.toLowerCase().trim()
                );

                setSupplier({ ...response.data, selectedCountry: countryData });
            } catch (err) {
                console.error(err);
                alert("Failed to fetch supplier details.");
            } finally {
                setLoading(false);
            }
        };

        fetchSupplierDetails();
    }, [supplierId, countryName]);

    if (loading) return <div className="text-center py-32 text-xl">Loading...</div>;
    if (!supplier) return <div className="text-center py-32 text-xl">Supplier not found.</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1C2554] to-[#BE965B]">
            <Header onProfileClick={() => navigate("/profile")} />
            <main className="max-w-5xl mx-auto py-16 px-6 text-white">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-6 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                >
                    ← Back
                </button>

                <h1 className="text-4xl font-bold mb-6">{supplier.supplierName}</h1>

                {/* Essential Contacts */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4">Essential Contacts</h2>
                    {supplier.contactPersons && supplier.contactPersons.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {supplier.contactPersons.map((contact) => (
                                <div key={contact.id} className="bg-white/10 p-4 rounded-xl shadow-md">
                                    <p className="font-bold text-lg flex items-center gap-2">
                                        <User size={20} /> {contact.name}
                                    </p>
                                    <p className="text-sm">Designation: {contact.designation || "N/A"}</p>
                                    <p className="text-sm">Email: {contact.email || "N/A"}</p>
                                    <p className="text-sm">Phone: {contact.phoneNumber || "N/A"}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No contact persons available.</p>
                    )}
                </section>

                {/* Airports & Prices */}
                <section>
                    <h2 className="text-2xl font-semibold mb-4">
                        Airports in {supplier.selectedCountry?.countryName}
                    </h2>

                    {supplier.selectedCountry?.airports && supplier.selectedCountry.airports.length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-6">
                            {supplier.selectedCountry.airports.map((airport) => (
                                <div key={airport.id} className="bg-white/10 p-4 rounded-xl shadow-md">
                                    <p className="font-bold flex items-center gap-2">
                                        <MapPin size={20} /> {airport.airportName}
                                    </p>
                                    <p className="text-sm">ICAO: {airport.icaoCode || "N/A"}</p>
                                    <p className="text-sm">IATA: {airport.iataCode || "N/A"}</p>
                                    <p className="text-sm">City: {airport.city || "N/A"}</p>

                                    {/* Prices */}
                                    {airport.prices && airport.prices.length > 0 ? (
                                        <div className="mt-3">
                                            <h3 className="font-semibold mb-1">Prices:</h3>
                                            {airport.prices.map((price, index) => (
                                                <div
                                                    key={index}
                                                    className="text-sm bg-white/20 p-2 rounded mb-1"
                                                >
                                                    Hook Up Fee: {price.hookUpFee} <br />
                                                    Low Fuel Cost: {price.lowFuelCost} <br />
                                                    Uplift: {price.uplift} <br />
                                                    Other Cost: {price.otherCost}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm mt-2">No prices available.</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No airports available for this country.</p>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
}
