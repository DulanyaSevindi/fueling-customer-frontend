import React from "react";
import { Plane, FileText, X } from "lucide-react";

export default function AddAircraftPopup({
                                             show,
                                             onClose,
                                             newAircraftData,
                                             handleChange,
                                             handleAdd, // parent function to save aircraft to DB
                                         }) {
    if (!show) return null;

    // Simple local validation before calling parent
    const handleAddClick = () => {
        if (!newAircraftData.aircraftTypeId || !newAircraftData.prefix || !newAircraftData.number) {
            alert("Fill all aircraft details");
            return;
        }

        handleAdd(); // call parent to save to DB
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-3 rounded-xl">
                            <Plane className="text-green-600" size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Add New Aircraft</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={32} />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Aircraft Type from local JSON */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <Plane size={18} className="text-green-600" /> Aircraft Type *
                        </label>
                        <select
                            name="aircraftTypeId"
                            value={newAircraftData.aircraftTypeId || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select aircraft type</option>
                            {newAircraftData.flightModels?.map((fm, idx) => (
                                <option
                                    key={`${fm.aircraftTypeId}-${fm.manufacturer}-${fm.model_name}-${idx}`}
                                    value={fm.aircraftTypeId}
                                >
                                    {fm.manufacturer} - {fm.model_name}
                                </option>
                            ))}

                        </select>
                    </div>

                    {/* Prefix */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <FileText size={18} className="text-green-600" /> Registration Prefix *
                        </label>
                        <select
                            name="prefix"
                            value={newAircraftData.prefix || ""}
                            onChange={handleChange}
                        >
                            <option value="">Select prefix</option>
                            {Array.isArray(newAircraftData.prefixes) &&
                                newAircraftData.prefixes.map((ac, idx) => (
                                    <option
                                        key={`${ac.prefix}-${ac.country}-${idx}`}
                                        value={ac.prefix}
                                    >
                                        {ac.prefix} - {ac.country}
                                    </option>
                                ))}

                        </select>
                    </div>

                    {/* Registration Number */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <FileText size={18} className="text-green-600" /> Registration Number *
                        </label>
                        <input
                            type="text"
                            name="number"
                            value={newAircraftData.number}
                            onChange={handleChange}
                            placeholder="e.g., ABC123"
                            className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-lg outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        />
                    </div>

                    {/* Preview */}
                    {newAircraftData.prefix && newAircraftData.number && (
                        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                            <p className="text-sm text-gray-600 mb-1">Full Registration:</p>
                            <p className="text-2xl font-bold text-green-700">
                                {newAircraftData.prefix}-{newAircraftData.number.toUpperCase()}
                            </p>
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-4 mt-8">
                    <button
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 text-lg rounded-xl font-bold transition-colors"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 text-lg rounded-xl font-bold transition-all shadow-lg"
                        onClick={handleAddClick}
                    >
                        Add Aircraft
                    </button>
                </div>
            </div>
        </div>
    );
}
