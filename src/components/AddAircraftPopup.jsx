import React from "react";
import { Plane, FileText, X, ChevronDown } from "lucide-react";

export default function AddAircraftPopup({
                                             show,
                                             onClose,
                                             newAircraftData,
                                             handleChange,
                                             handleAdd,
                                         }) {
    const [aircraftSearch, setAircraftSearch] = React.useState("");
    const [prefixSearch, setPrefixSearch] = React.useState("");
    const [showAircraftDropdown, setShowAircraftDropdown] = React.useState(false);
    const [showPrefixDropdown, setShowPrefixDropdown] = React.useState(false);

    const aircraftDropdownRef = React.useRef(null);
    const prefixDropdownRef = React.useRef(null);

    // Filter aircraft types based on search
    const filteredAircraftTypes = React.useMemo(() => {
        if (!newAircraftData.flightModels) return [];
        if (!aircraftSearch) return newAircraftData.flightModels;

        const searchLower = aircraftSearch.toLowerCase();
        return newAircraftData.flightModels.filter(fm =>
            fm.manufacturer?.toLowerCase().includes(searchLower) ||
            fm.model_name?.toLowerCase().includes(searchLower)
        );
    }, [newAircraftData.flightModels, aircraftSearch]);

    // Filter prefixes based on search
    const filteredPrefixes = React.useMemo(() => {
        if (!Array.isArray(newAircraftData.prefixes)) return [];
        if (!prefixSearch) return newAircraftData.prefixes;

        const searchLower = prefixSearch.toLowerCase();
        return newAircraftData.prefixes.filter(ac =>
            ac.prefix?.toLowerCase().includes(searchLower) ||
            ac.country?.toLowerCase().includes(searchLower)
        );
    }, [newAircraftData.prefixes, prefixSearch]);

    // Close dropdowns when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (aircraftDropdownRef.current && !aircraftDropdownRef.current.contains(event.target)) {
                setShowAircraftDropdown(false);
                setAircraftSearch("");
            }
            if (prefixDropdownRef.current && !prefixDropdownRef.current.contains(event.target)) {
                setShowPrefixDropdown(false);
                setPrefixSearch("");
            }
        };

        if (showAircraftDropdown || showPrefixDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showAircraftDropdown, showPrefixDropdown]);

    if (!show) return null;

    const handleAddClick = () => {
        if (!newAircraftData.aircraftTypeId || !newAircraftData.prefix || !newAircraftData.number) {
            alert("Fill all aircraft details");
            return;
        }
        handleAdd();
    };

    // Get selected aircraft display text
    const getSelectedAircraftText = () => {
        if (!newAircraftData.aircraftTypeId) return "";
        const selected = newAircraftData.flightModels?.find(fm => String(fm.aircraftTypeId) === String(newAircraftData.aircraftTypeId));
        return selected ? `${selected.manufacturer} - ${selected.model_name}` : "";
    };

    // Get selected prefix display text
    const getSelectedPrefixText = () => {
        if (!newAircraftData.prefix) return "";
        const selected = newAircraftData.prefixes?.find(ac => ac.prefix === newAircraftData.prefix);
        return selected ? `${selected.prefix} - ${selected.country}` : "";
    };

    // Handle aircraft selection
    const handleAircraftSelect = (fm) => {
        // Create a proper synthetic event
        const syntheticEvent = {
            target: {
                name: 'aircraftTypeId',
                value: fm.aircraftTypeId
            }
        };
        handleChange(syntheticEvent);
        setShowAircraftDropdown(false);
        setAircraftSearch("");
    };

    // Handle prefix selection
    const handlePrefixSelect = (prefix) => {
        // Create a proper synthetic event
        const syntheticEvent = {
            target: {
                name: 'prefix',
                value: prefix
            }
        };
        handleChange(syntheticEvent);
        setShowPrefixDropdown(false);
        setPrefixSearch("");
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 transform transition-all max-h-[90vh] overflow-y-auto">
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
                    {/* Aircraft Type */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <Plane size={18} className="text-green-600" /> Aircraft Type *
                        </label>

                        <div className="relative" ref={aircraftDropdownRef}>
                            <div
                                onClick={() => setShowAircraftDropdown(!showAircraftDropdown)}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-lg outline-none focus:border-green-600 cursor-pointer flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                            >
                                <span className={getSelectedAircraftText() ? "text-gray-800" : "text-gray-400"}>
                                    {getSelectedAircraftText() || "Select aircraft type"}
                                </span>
                                <ChevronDown className={`transition-transform ${showAircraftDropdown ? 'rotate-180' : ''}`} size={20} />
                            </div>

                            {showAircraftDropdown && (
                                <div className="absolute w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-10 max-h-80 overflow-hidden">
                                    <div className="p-2 border-b border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Search aircraft type..."
                                            value={aircraftSearch}
                                            onChange={(e) => setAircraftSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="overflow-y-auto max-h-60">
                                        {filteredAircraftTypes.map((fm, idx) => (
                                            <div
                                                key={`${fm.aircraftTypeId}-${fm.manufacturer}-${fm.model_name}-${idx}`}
                                                onClick={() => handleAircraftSelect(fm)}
                                                className={`px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors ${
                                                    String(newAircraftData.aircraftTypeId) === String(fm.aircraftTypeId) ? 'bg-green-100 font-semibold' : ''
                                                }`}
                                            >
                                                {fm.manufacturer} - {fm.model_name}
                                            </div>
                                        ))}
                                        {filteredAircraftTypes.length === 0 && (
                                            <div className="px-4 py-3 text-gray-500 text-center">No matching aircraft found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Prefix */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                            <FileText size={18} className="text-green-600" /> Registration Prefix *
                        </label>

                        <div className="relative" ref={prefixDropdownRef}>
                            <div
                                onClick={() => setShowPrefixDropdown(!showPrefixDropdown)}
                                className="w-full border-2 border-gray-300 rounded-xl px-4 py-4 text-lg outline-none focus:border-green-600 cursor-pointer flex items-center justify-between bg-white hover:border-gray-400 transition-colors"
                            >
                                <span className={getSelectedPrefixText() ? "text-gray-800" : "text-gray-400"}>
                                    {getSelectedPrefixText() || "Select prefix"}
                                </span>
                                <ChevronDown className={`transition-transform ${showPrefixDropdown ? 'rotate-180' : ''}`} size={20} />
                            </div>

                            {showPrefixDropdown && (
                                <div className="absolute w-full mt-2 bg-white border-2 border-gray-300 rounded-xl shadow-lg z-10 max-h-80 overflow-hidden">
                                    <div className="p-2 border-b border-gray-200">
                                        <input
                                            type="text"
                                            placeholder="Search prefix or country..."
                                            value={prefixSearch}
                                            onChange={(e) => setPrefixSearch(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-green-600"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                    <div className="overflow-y-auto max-h-60">
                                        {filteredPrefixes.map((ac, idx) => (
                                            <div
                                                key={`${ac.prefix}-${ac.country}-${idx}`}
                                                onClick={() => handlePrefixSelect(ac.prefix)}
                                                className={`px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors ${
                                                    newAircraftData.prefix === ac.prefix ? 'bg-green-100 font-semibold' : ''
                                                }`}
                                            >
                                                {ac.prefix} - {ac.country}
                                            </div>
                                        ))}
                                        {filteredPrefixes.length === 0 && (
                                            <div className="px-4 py-3 text-gray-500 text-center">No matching prefix found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
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