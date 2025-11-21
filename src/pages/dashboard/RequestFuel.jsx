import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Plane, Calendar, Droplet } from "lucide-react";
import flightModelsData from "../../data/flight_model.json";
import aircraftRegistrations from "../../data/AircraftRegistration.json";
import AddAircraftPopup from "../../components/AddAircraftPopup.jsx";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Lottie from "lottie-react";
import submissionAnimation from "../../assets/Email Send.json";

export default function RequestFuel() {
    const location = useLocation();
    const navigate = useNavigate();
    const customerId = location.state?.customerId || null;

    const [formData, setFormData] = useState({
        operatorName: "",
        aircraftPrefix: "",
        aircraftNumber: "",
        departureAirport: "",
        departureDate: "",
        departureTime: "",
        arrivalAirport: "",
        arrivalDate: "",
        arrivalTime: "",
        fuelType: "",
        fuelQuantity: "",
    });

    const [registeredAircrafts, setRegisteredAircrafts] = useState([]);
    const [aircraftTypes, setAircraftTypes] = useState([]);
    const [selectedAircraftId, setSelectedAircraftId] = useState(null);
    const [selectedAircraftTypeId, setSelectedAircraftTypeId] = useState(null);


    const [showAddAircraftPopup, setShowAddAircraftPopup] = useState(false);
    const [newAircraftData, setNewAircraftData] = useState({
        aircraftTypeId: "",
        prefix: "",
        number: "",
        flightModels: flightModelsData,
        prefixes: aircraftRegistrations.ac_reg_code
    });

    const [loading, setLoading] = useState(false);
    const [supplier] = useState({ supplierName: "ABC Fuel Supplies", supplierId: "supplier_123" });
    const [showSubmissionAnimation, setShowSubmissionAnimation] = useState(false);


    // Prevent swipe navigation
    useEffect(() => {
        const preventSwipe = (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        const preventNavigation = (e) => {
            // Prevent browser back/forward swipe gestures
            if (e.deltaX > 50 || e.deltaX < -50) {
                e.preventDefault();
            }
        };

        document.addEventListener('touchmove', preventSwipe, { passive: false });
        document.addEventListener('wheel', preventNavigation, { passive: false });

        // Disable browser navigation gestures
        document.body.style.overscrollBehaviorX = 'none';

        return () => {
            document.removeEventListener('touchmove', preventSwipe);
            document.removeEventListener('wheel', preventNavigation);
            document.body.style.overscrollBehaviorX = 'auto';
        };
    }, []);

    // Fetch aircraft types from backend
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/fuel-requests/aircraft-types`)
            .then(res => setAircraftTypes(res.data))
            .catch(err => console.error("Failed to fetch aircraft types:", err));
    }, []);

    // Fetch customer's registered aircrafts
    useEffect(() => {
        const fetchCustomerAircrafts = async () => {
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_API_URL}/fuel-requests/customer/${customerId}/aircrafts`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` } }
                );

                setRegisteredAircrafts(res.data.aircrafts.map(ac => ({
                    id: ac.id,
                    type: ac.aircraftType.model_name,
                    prefix: ac.prefix,
                    number: ac.registration_number,
                    aircraftTypeId: ac.aircraftType.id,
                    customerId
                })));
            } catch (err) {
                console.error("Failed to fetch customer aircrafts:", err);
            }
        };

        fetchCustomerAircrafts();
    }, [customerId]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNewAircraftChange = (e) => {
        const { name, value } = e.target;
        setNewAircraftData(prev => ({
            ...prev,
            [name]: name === "aircraftTypeId" ? parseInt(value) || "" : value
        }));
    };

    // Select existing aircraft
    const handleAircraftSelect = (id) => {
        const aircraft = registeredAircrafts.find(ac => ac.id === Number(id));

        if (aircraft) {
            setFormData(prev => ({
                ...prev,
                aircraftNumber: aircraft.number,
                aircraftPrefix: aircraft.prefix
            }));
            setSelectedAircraftId(aircraft.id);
            setSelectedAircraftTypeId(aircraft.aircraftTypeId);
        } else {
            setFormData(prev => ({ ...prev, aircraftNumber: "", aircraftPrefix: "" }));
            setSelectedAircraftId(null);
            setSelectedAircraftTypeId(null);
        }
    };

    // Add new aircraft to backend & state
    const handleAddNewAircraft = async () => {
        console.log("New Aircraft Data:", newAircraftData)
        if (!newAircraftData.aircraftTypeId || !newAircraftData.prefix || !newAircraftData.number) {
            alert("Fill all aircraft details");
            return;
        }

        const selectedType = newAircraftData.flightModels.find(
            fm => Number(fm.aircraftTypeId) === Number(newAircraftData.aircraftTypeId)
        );

        if (!selectedType) {
            alert("Please select a valid aircraft type");
            return;
        }

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/aircrafts`, {
                customerId,
                aircraftTypeId: newAircraftData.aircraftTypeId,
                manufacturer: selectedType.manufacturer,
                model_name: selectedType.model_name,
                registration_number: newAircraftData.number.toUpperCase(),
                prefix: newAircraftData.prefix.toUpperCase(),
                registered_country: "US"
            });

            const addedAircraft = response.data;
            setRegisteredAircrafts(prev => [
                ...prev,
                {
                    id: addedAircraft.id,
                    prefix: addedAircraft.prefix,
                    number: addedAircraft.registration_number,
                    type: selectedType ? `${selectedType.manufacturer} - ${selectedType.model_name}` : "Unknown",
                    aircraftTypeId: addedAircraft.aircraftTypeId,
                    customerId
                }
            ]);

            setFormData(prev => ({
                ...prev,
                aircraftNumber: addedAircraft.registration_number,
                aircraftPrefix: addedAircraft.prefix
            }));
            setSelectedAircraftId(addedAircraft.id);
            setSelectedAircraftTypeId(addedAircraft.aircraftTypeId);

            setShowAddAircraftPopup(false);
            setNewAircraftData(prev => ({
                ...prev,
                aircraftTypeId: "",
                prefix: "",
                number: ""
            }));

        } catch (err) {
            console.error("Failed to add aircraft:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to add aircraft");
        }
    };

    // Submit fuel request
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowSubmissionAnimation(true); // show Lottie animation

        try {
            const payload = {
                customerId,
                operatorName: formData.operatorName,
                aircraftId: selectedAircraftId || null,
                aircraftTypeId: selectedAircraftId
                    ? selectedAircraftTypeId
                    : newAircraftData.aircraftTypeId,
                registration_number: selectedAircraftId
                    ? registeredAircrafts.find(ac => ac.id === selectedAircraftId)?.number
                    : newAircraftData.number?.toUpperCase(),

                prefix: selectedAircraftId
                    ? registeredAircrafts.find(ac => ac.id === selectedAircraftId)?.prefix
                    : newAircraftData.prefix?.toUpperCase(),

                registered_country: selectedAircraftId
                    ? registeredAircrafts.find(ac => ac.id === selectedAircraftId)?.registered_country || "US"
                    : "US",

                fuelType: formData.fuelType,
                quantity: formData.fuelQuantity,
                departureLocation: formData.departureAirport,
                departureDate: formData.departureDate,
                departureTime: formData.departureTime,
                arrivalLocation: formData.arrivalAirport,
                arrivalDate: formData.arrivalDate,
                arrivalTime: formData.arrivalTime
            };

            await axios.post(
                `${import.meta.env.VITE_API_URL}/fuel-requests`,
                payload,
                { headers: { Authorization: `Bearer ${localStorage.getItem("customerToken")}` } }
            );

            // Reset form after submission
            setFormData({
                operatorName: "",
                aircraftPrefix: "",
                aircraftNumber: "",
                departureAirport: "",
                departureDate: "",
                departureTime: "",
                arrivalAirport: "",
                arrivalDate: "",
                arrivalTime: "",
                fuelType: "",
                fuelQuantity: "",
            });
            setSelectedAircraftId(null);
            setSelectedAircraftTypeId(null);
            setNewAircraftData(prev => ({ ...prev, aircraftTypeId: "", prefix: "", number: "" }));

            // Hide animation after 2 seconds
            setTimeout(() => setShowSubmissionAnimation(false), 2000);

        } catch (err) {
            console.error("Error submitting request:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to submit request");
            setShowSubmissionAnimation(false);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#1C2554] to-[#BE965B] overflow-auto" style={{ overscrollBehaviorX: 'none' }}>
            {/* Header */}
            <div className="flex-none p-4">
                <Header onProfileClick={() => {}} />
            </div>

            {/* Form Container - Horizontal Layout */}
            <div className="flex-grow flex justify-center items-start py-6 px-6">
                <form onSubmit={handleSubmit} className="w-full max-w-[1400px] bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                    {/* Form Header Inside Card */}
                    <div className="bg-gradient-to-r from-slate-800 via-slate-800 to-slate-600 px-8 py-6 border-b-4 border-amber-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <img
                                    src="https://ftsaero.com/wp-content/uploads/2023/06/fts-logo-gold-white.png"
                                    alt="FTS Aero Logo"
                                    className="h-10 object-contain"
                                />
                                <div className="border-l-2 border-amber-500 pl-6">
                                    <h1 className="text-2xl font-bold text-white mb-2">Fuel Request Form</h1>
                                    <p className="text-amber-100 text-base">
                                        Fuel Provider: <span className="font-semibold text-amber-300">{supplier.supplierName}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="p-3 bg-white/10 hover:bg-amber-500/20 rounded-xl transition-all duration-300 border border-amber-500/30 hover:border-amber-500"
                            >
                                <ArrowLeft className="w-6 h-6 text-black" />
                            </button>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Main Grid - 2 Columns */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Left Column */}
                            <div className="space-y-6">
                                {/* Operator Section */}
                                <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100">
                                    <div className="flex items-center gap-3 pb-3 border-b-2 border-blue-200">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Plane className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Operator Information</h2>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Operator Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="operatorName"
                                            value={formData.operatorName}
                                            onChange={handleFormChange}
                                            placeholder="Enter operator name"
                                            className="w-full border-2 border-blue-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Aircraft Section */}
                                <div className="space-y-4 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
                                    <div className="flex items-center gap-3 pb-3 border-b-2 border-purple-200">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Plane className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Aircraft Details</h2>
                                    </div>

                                    <div>
                                        <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                            Select Aircraft <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={selectedAircraftId || ""}
                                            onChange={(e) => handleAircraftSelect(e.target.value)}
                                            className="w-full border-2 border-purple-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none transition-all duration-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 bg-white"
                                            required
                                        >
                                            <option value="">Choose an aircraft</option>
                                            {registeredAircrafts.map(ac => (
                                                <option key={ac.id} value={ac.id}>
                                                    {ac.prefix}-{ac.number} ({ac.type})
                                                </option>
                                            ))}
                                        </select>

                                        <button
                                            type="button"
                                            onClick={() => setShowAddAircraftPopup(true)}
                                            className="mt-3 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-green-200 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 text-sm"
                                        >
                                            + Add New Aircraft
                                        </button>
                                    </div>
                                </div>

                                {/* Fuel Section */}
                                <div className="space-y-4 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-100">
                                    <div className="flex items-center gap-3 pb-3 border-b-2 border-amber-200">
                                        <div className="p-2 bg-amber-100 rounded-lg">
                                            <Droplet className="w-5 h-5 text-amber-600" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Fuel Requirements</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Fuel Type <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fuelType"
                                                value={formData.fuelType}
                                                onChange={handleFormChange}
                                                placeholder="e.g., Jet A-1, Avgas 100LL"
                                                className="w-full border-2 border-amber-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 bg-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-2 block">
                                                Quantity (Litres) <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                name="fuelQuantity"
                                                value={formData.fuelQuantity}
                                                onChange={handleFormChange}
                                                placeholder="Enter quantity"
                                                className="w-full border-2 border-amber-200 rounded-xl px-4 py-2.5 text-gray-700 outline-none transition-all duration-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 bg-white"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Flight Schedule */}
                            <div className="space-y-6">
                                <div className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-200">
                                    <div className="flex items-center gap-3 pb-3 border-b-2 border-gray-300">
                                        <div className="p-2 bg-gray-200 rounded-lg">
                                            <Calendar className="w-5 h-5 text-gray-700" />
                                        </div>
                                        <h2 className="text-lg font-bold text-gray-800">Flight Schedule</h2>
                                    </div>

                                    {/* Departure */}
                                    <div className="space-y-3 p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <h3 className="font-bold text-gray-800">Departure</h3>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                Airport Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="departureAirport"
                                                value={formData.departureAirport}
                                                onChange={handleFormChange}
                                                placeholder="e.g., JFK"
                                                className="w-full border-2 border-green-200 rounded-xl px-4 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                    Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="departureDate"
                                                    value={formData.departureDate}
                                                    onChange={handleFormChange}
                                                    className="w-full border-2 border-green-200 rounded-xl px-3 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                    Time <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="departureTime"
                                                    value={formData.departureTime}
                                                    onChange={handleFormChange}
                                                    className="w-full border-2 border-green-200 rounded-xl px-3 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Arrival */}
                                    <div className="space-y-3 p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                            <h3 className="font-bold text-gray-800">Arrival</h3>
                                        </div>

                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                Airport Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="arrivalAirport"
                                                value={formData.arrivalAirport}
                                                onChange={handleFormChange}
                                                placeholder="e.g., LAX"
                                                className="w-full border-2 border-red-200 rounded-xl px-4 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-white"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                    Date <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="date"
                                                    name="arrivalDate"
                                                    value={formData.arrivalDate}
                                                    onChange={handleFormChange}
                                                    className="w-full border-2 border-red-200 rounded-xl px-3 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                                                    Time <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="time"
                                                    name="arrivalTime"
                                                    value={formData.arrivalTime}
                                                    onChange={handleFormChange}
                                                    className="w-full border-2 border-red-200 rounded-xl px-3 py-2 text-gray-700 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100 bg-white"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-gray-50 px-8 py-5 border-t border-gray-200 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-2.5 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="flex-none">
                <Footer />
            </div>

            <AddAircraftPopup
                show={showAddAircraftPopup}
                onClose={() => setShowAddAircraftPopup(false)}
                newAircraftData={newAircraftData}
                handleChange={handleNewAircraftChange}
                handleAdd={handleAddNewAircraft}
                aircraftTypes={aircraftTypes}
            />
            {/* Submission Lottie Animation */}
            {showSubmissionAnimation && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                    <Lottie animationData={submissionAnimation} loop={false} className="w-40 h-40" />
                    <h1 className="mt-4 text-white text-2xl font-bold animate-pulse">Submitted!</h1>
                </div>
            )}

        </div>
    );
}