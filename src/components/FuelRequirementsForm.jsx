import React from "react";
import { Fuel } from "lucide-react";

export default function FuelRequirementsForm({ formData, handleChange }) {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Fuel className="text-purple-600" size={28} />
                </div>
                Fuel Requirements
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Fuel Type *</label>
                    <input
                        type="text"
                        name="fuelType"
                        value={formData.fuelType}
                        onChange={handleChange}
                        placeholder="Enter the Fuel type"
                        className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Fuel Quantity (Litres) *</label>
                    <input
                        type="number"
                        name="fuelQuantity"
                        value={formData.fuelQuantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        className="w-full border-2 border-gray-300 rounded-xl px-4 py-3 text-lg outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200"
                    />
                </div>
            </div>
        </div>
    );
}
