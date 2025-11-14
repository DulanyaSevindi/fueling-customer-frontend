import axios from "axios";
import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import aircraftRegistrations from "../../data/AircraftRegistration.json";
import flightModelsData from "../../data/flight_model.json";
import AddAircraftPopup from "../../components/AddAircraftPopup.jsx";
import OperatorAircraftForm from "../../components/OperatorAircraftForm.jsx";
import FlightScheduleForm from "../../components/FlightScheduleForm.jsx";
import FuelRequirementsForm from "../../components/FuelRequirementsForm.jsx";

export default function RequestFuel() {
    const [formData, setFormData] = useState({
        operatorName: "",
        aircraftType: "",
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

    const [newAircraftData, setNewAircraftData] = useState({
        aircraftType: "",
        prefix: "",
        number: "",
        flightModels: flightModelsData,
        prefixes: aircraftRegistrations.ac_reg_code || []
    });

    const [registeredAircrafts, setRegisteredAircrafts] = useState([]);
    const [showAddAircraftPopup, setShowAddAircraftPopup] = useState(false);
    const [loading, setLoading] = useState(false);

    const customerId = "customer_123";
    const [supplier] = useState({ supplierName: "ABC Fuel Supplies" });

    // Fetch customer's registered aircrafts
    useEffect(() => {
        const fetchCustomerAircrafts = async () => {
            try {
                const response = await axios.get(`/api/fuel-requests/customer/${customerId}`);
                const requests = response.data?.fuelRequests || [];

                const aircraftList = requests
                    .map(req => req.aircraft ? {
                        id: req.aircraft.id,
                        type: req.aircraft.aircraftType?.model_name || "",
                        prefix: req.aircraft.prefix || "",
                        number: req.aircraft.registration_number || "",
                    } : null)
                    .filter(Boolean);

                setRegisteredAircrafts(aircraftList);

                // Only pre-fill if no aircraft selected yet
                if (!formData.aircraftNumber && aircraftList.length > 0) {
                    setFormData(prev => ({
                        ...prev,
                        aircraftType: aircraftList[0].type,
                        aircraftPrefix: aircraftList[0].prefix,
                        aircraftNumber: aircraftList[0].number
                    }));
                }
            } catch (err) {
                console.error("Error fetching customer aircrafts:", err);
                setRegisteredAircrafts([]);
            }
        };

        fetchCustomerAircrafts();
    }, [customerId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "aircraftPrefix" ? value.toUpperCase() : value
        }));
    };

    const handleNewAircraftChange = (e) => {
        const { name, value } = e.target;
        setNewAircraftData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddNewAircraft = () => {
        if (!newAircraftData.aircraftType || !newAircraftData.prefix || !newAircraftData.number) {
            alert("Please fill in all aircraft details");
            return;
        }

        const newAircraft = {
            id: Date.now().toString(),
            type: newAircraftData.aircraftType,
            prefix: newAircraftData.prefix.toUpperCase(),
            number: newAircraftData.number.toUpperCase(),
            customerId
        };

        setRegisteredAircrafts(prev => [...prev, newAircraft]);

        setFormData(prev => ({
            ...prev,
            aircraftType: newAircraft.type,
            aircraftPrefix: newAircraft.prefix,
            aircraftNumber: newAircraft.number
        }));

        setNewAircraftData({ ...newAircraftData, aircraftType: "", prefix: "", number: "" });
        setShowAddAircraftPopup(false);
        alert("Aircraft added and form updated!");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const aircraftTypeResponse = await axios.get("/api/aircraft-types");
            const aircraftTypeArray = Array.isArray(aircraftTypeResponse.data) ? aircraftTypeResponse.data : [];
            const aircraftTypeRecord = aircraftTypeArray.find(
                (type) => type.model_name === formData.aircraftType
            );

            if (!aircraftTypeRecord) {
                alert("Aircraft type not found");
                setLoading(false);
                return;
            }

            const payload = {
                customerId,
                fuelType: formData.fuelType,
                quantity: Number(formData.fuelQuantity),
                departureLocation: formData.departureAirport,
                departureDate: formData.departureDate,
                departureTime: formData.departureTime,
                arrivalLocation: formData.arrivalAirport,
                arrivalDate: formData.arrivalDate,
                arrivalTime: formData.arrivalTime,
                aircraftTypeId: aircraftTypeRecord.id,
                registration_number: formData.aircraftNumber,
                prefix: formData.aircraftPrefix,
                registered_country: "Unknown",
            };

            const response = await axios.post("/api/fuel-requests", payload);
            console.log("FuelRequest created:", response.data);
            alert("Fuel request submitted successfully!");
        } catch (error) {
            console.error("Error submitting fuel request:", error.response?.data || error.message);
            alert("Failed to submit fuel request. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-[#1C2554] to-[#BE965B] overflow-auto">
            {/* Header */}
            <div className="w-full bg-gradient-to-r from-[#1C2554] to-[#BE965B] shadow-2xl flex-none">
                <div className="w-full max-w-[1100px] mx-auto px-8 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="bg-white/20 backdrop-blur-sm p-5 rounded-2xl"></div>
                        <div>
                            <h1 className="text-5xl font-bold text-white mb-1">Fuel Request Form</h1>
                            <p className="text-white/90 text-2xl">
                                Supplier: <span className="font-semibold">{supplier.supplierName}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => console.log("Back to Dashboard")}
                        className="bg-white/20 hover:bg-white/30 text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-3"
                    >
                        <ArrowLeft size={24} /> Back to Dashboard
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex justify-center items-start py-8 px-6">
                <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <OperatorAircraftForm
                        formData={formData}
                        handleChange={handleChange}
                        registeredAircrafts={registeredAircrafts}
                        onAddNewAircraft={() => setShowAddAircraftPopup(true)}
                    />

                    <FlightScheduleForm formData={formData} handleChange={handleChange} />
                    <FuelRequirementsForm formData={formData} handleChange={handleChange} />

                    {/* Submit Buttons */}
                    <div className="p-8 border-t-4 border-gray-100 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => console.log("Cancel")}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-xl font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-6 rounded-xl font-bold shadow-lg"
                        >
                            {loading ? "Submitting..." : "Submit Request"}
                        </button>
                    </div>
                </div>
            </div>

            <AddAircraftPopup
                show={showAddAircraftPopup}
                onClose={() => setShowAddAircraftPopup(false)}
                newAircraftData={newAircraftData}
                handleChange={handleNewAircraftChange}
                handleAdd={handleAddNewAircraft}
            />
        </div>
    );
}
