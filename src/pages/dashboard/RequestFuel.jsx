import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import flightModelsData from "../../data/flight_model.json";
import aircraftRegistrations from "../../data/AircraftRegistration.json";
import AddAircraftPopup from "../../components/AddAircraftPopup.jsx";

export default function RequestFuel() {
    const location = useLocation();
    const customerId = location.state?.customerId || 123;

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

    // Form change handlers
    const handleChange = (e) => {
        const { name, value } = e.target;

        setNewAircraftData(prev => ({
            ...prev,
            [name]: name === "aircraftTypeId" ? Number(value) : value
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
// Add Aircraft to DB
    const handleAddNewAircraft = async () => {
        console.log("New Aircraft Data:", newAircraftData)
        if (!newAircraftData.aircraftTypeId || !newAircraftData.prefix || !newAircraftData.number) {
            alert("Fill all aircraft details");
            return;
        }

        // Use selectedType from local JSON only to get manufacturer & model_name
        // Use local JSON to get manufacturer & model_name
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


            // Update state so main dropdown shows new aircraft
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

            // Auto-select newly added aircraft
            setFormData(prev => ({
                ...prev,
                aircraftNumber: addedAircraft.registration_number,
                aircraftPrefix: addedAircraft.prefix
            }));
            setSelectedAircraftId(addedAircraft.id);
            setSelectedAircraftTypeId(addedAircraft.aircraftTypeId);

            // Close popup & reset fields
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

        try {
            const payload = {
                customerId,
                operatorName: formData.operatorName,
                aircraftId: selectedAircraftId || null,
                aircraftTypeId: selectedAircraftId
                    ? selectedAircraftTypeId
                    : newAircraftData.aircraftTypeId,
                registration_number: selectedAircraftId ? null : newAircraftData.number?.toUpperCase(),
                prefix: selectedAircraftId ? null : newAircraftData.prefix?.toUpperCase(),
                registered_country: selectedAircraftId ? null : "Country",
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

            alert("Fuel request submitted!");

            // Reset form
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
        } catch (err) {
            console.error("Error submitting request:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#1C2554] to-[#BE965B] overflow-auto">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-[#1C2554] to-[#BE965B] shadow-2xl flex-none">
                <div className="w-full max-w-[1100px] mx-auto px-8 py-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-5xl font-bold text-white mb-1">Fuel Request Form</h1>
                        <p className="text-white/90 text-2xl">
                            Supplier: <span className="font-semibold">{supplier.supplierName}</span>
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="flex-grow flex justify-center items-start py-8 px-6">
                <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden p-8 space-y-6">

                    {/* Operator Name */}
                    <div>
                        <label className="font-bold text-gray-700 mb-2 block">Operator Name *</label>
                        <input
                            type="text"
                            name="operatorName"
                            value={formData.operatorName}
                            onChange={handleChange}
                            placeholder="Enter operator name"
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                        />
                    </div>

                    {/* Aircraft Selection */}
                    <div>
                        <label className="font-bold text-gray-700 mb-2 block">Select Aircraft *</label>
                        <select
                            value={selectedAircraftId || ""}
                            onChange={(e) => handleAircraftSelect(e.target.value)}
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none"
                        >
                            <option value="">Select Aircraft</option>
                            {registeredAircrafts.map(ac => (
                                <option key={ac.id} value={ac.id}>
                                    {ac.prefix}-{ac.number} ({ac.type})
                                </option>
                            ))}
                        </select>


                        <button
                            type="button"
                            onClick={() => setShowAddAircraftPopup(true)}
                            className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold"
                        >
                            Add New Aircraft
                        </button>
                    </div>

                    {/* Flight Schedule */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="font-bold text-gray-700 mb-2 block">Departure Airport *</label>
                            <input
                                type="text"
                                name="departureAirport"
                                value={formData.departureAirport}
                                onChange={handleChange}
                                placeholder="Airport Code"
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} className="border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200" />
                                <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} className="border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200" />
                            </div>
                        </div>

                        <div>
                            <label className="font-bold text-gray-700 mb-2 block">Arrival Airport *</label>
                            <input type="text" name="arrivalAirport" value={formData.arrivalAirport} onChange={handleChange} placeholder="Airport Code" className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200" />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <input type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} className="border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200" />
                                <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} className="border-2 border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200" />
                            </div>
                        </div>
                    </div>

                    {/* Fuel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                            <label className="font-bold text-gray-700 mb-2 block">Fuel Type *</label>
                            <input type="text" name="fuelType" value={formData.fuelType} onChange={handleChange} placeholder="Enter Fuel Type" className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200" />
                        </div>
                        <div>
                            <label className="font-bold text-gray-700 mb-2 block">Fuel Quantity (Litres) *</label>
                            <input type="number" name="fuelQuantity" value={formData.fuelQuantity} onChange={handleChange} placeholder="Quantity" className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200" />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-bold">Cancel</button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-bold">{loading ? "Submitting..." : "Submit Request"}</button>
                    </div>
                </div>
            </form>

            <AddAircraftPopup
                show={showAddAircraftPopup}
                onClose={() => setShowAddAircraftPopup(false)}
                newAircraftData={newAircraftData}
                handleChange={handleNewAircraftChange}
                handleAdd={handleAddNewAircraft}
                aircraftTypes={aircraftTypes}
            />
        </div>
    );
}
