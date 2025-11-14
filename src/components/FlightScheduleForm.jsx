import React from "react";
import { Calendar, MapPin } from "lucide-react";

export default function FlightScheduleForm({ formData, handleChange }) {
    return (
        <div className="p-8 border-b-4 border-gray-100 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Calendar className="text-blue-600" size={28} />
                </div>
                Flight Schedule
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-green-600" /> Departure
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="departureAirport"
                            value={formData.departureAirport}
                            onChange={handleChange}
                            placeholder="Airport Code (e.g., JFK)"
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                name="departureDate"
                                value={formData.departureDate}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                            />
                            <input
                                type="time"
                                name="departureTime"
                                value={formData.departureTime}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-200"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-red-200">
                    <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-red-600" /> Arrival
                    </h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="arrivalAirport"
                            value={formData.arrivalAirport}
                            onChange={handleChange}
                            placeholder="Airport Code (e.g., LAX)"
                            className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                        />
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                name="arrivalDate"
                                value={formData.arrivalDate}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                            />
                            <input
                                type="time"
                                name="arrivalTime"
                                value={formData.arrivalTime}
                                onChange={handleChange}
                                className="border-2 border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-red-600 focus:ring-2 focus:ring-red-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
