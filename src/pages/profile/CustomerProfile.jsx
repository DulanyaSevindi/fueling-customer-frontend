import React, { useState } from "react";

export default function CustomerProfile({ onBack }) {
    const [profileData, setProfileData] = useState({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1 555-123-4567",
        company: "Aviation Inc.",
        position: "Manager"
    });

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        alert("Profile updated successfully!");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Customer Profile</h1>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="flex items-center gap-6 mb-8 pb-8 border-b">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
                            {profileData.firstName[0]}{profileData.lastName[0]}
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <p className="text-gray-600">{profileData.position} at {profileData.company}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={profileData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={profileData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={profileData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Company</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={profileData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                                <input
                                    type="text"
                                    name="position"
                                    value={profileData.position}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4 pt-6">
                            <button
                                onClick={handleSave}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={onBack}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
