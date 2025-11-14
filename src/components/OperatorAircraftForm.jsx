import React from "react";
import { Plane, User, FileText, Plus } from "lucide-react";

export default function OperatorAircraftForm({
                                                 formData,
                                                 handleChange,
                                                 registeredAircrafts = [],
                                                 onAddNewAircraft
                                             }) {

    return (
        <div className="p-8 border-b-4 border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-amber-100 p-2 rounded-lg">
                    <Plane className="text-amber-600" size={28} />
                </div>
                Operator & Aircraft Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Operator Name */}
                <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                        <User size={18} className="text-amber-600" /> Operator Name *
                    </label>
                    <input
                        type="text"
                        name="operatorName"
                        value={formData.operatorName}
                        onChange={handleChange}
                        placeholder="Enter operator name"
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200 transition-all"
                    />
                </div>

                {/* Aircraft Section */}
                <div className="flex-1 col-span-2">
                    {registeredAircrafts.length === 0 ? (
                        // New customer: No aircraft yet
                        <p className="text-gray-600">No aircraft added yet. Please add one.</p>
                    ) : (
                        // Returning customer: Show dropdown of their aircrafts
                        <>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                                <FileText size={18} className="text-amber-600" /> Select Aircraft *
                            </label>
                            <select
                                name="aircraftNumber"
                                value={formData.aircraftNumber || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const selected = registeredAircrafts.find((ac) => ac.id === selectedId);
                                    if (selected) {
                                        handleChange({ target: { name: "aircraftNumber", value: selected.number } });
                                        handleChange({ target: { name: "aircraftPrefix", value: selected.prefix } });
                                        handleChange({ target: { name: "aircraftType", value: selected.type } });
                                    }
                                }}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-200"
                            >
                                <option value="">Select Aircraft</option>
                                {registeredAircrafts.map((ac) => (
                                    <option key={ac.id} value={ac.id}>
                                        {ac.prefix}-{ac.number} ({ac.type})
                                    </option>
                                ))}
                            </select>
                        </>
                    )}
                </div>

                {/* Add New Aircraft Button */}
                <div className="mt-6 lg:col-span-3">
                    <button
                        type="button"
                        onClick={onAddNewAircraft}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all"
                    >
                        <Plus size={20} /> Add New Aircraft
                    </button>
                </div>
            </div>
        </div>
    );
}
