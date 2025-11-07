import React from "react";

export default function Footer() {
    return (
        <footer
            className="relative mt-auto rounded-t-3xl overflow-hidden text-white"
            style={{
                backgroundImage: `url('https://ftsaero.com/wp-content/uploads/2023/07/fts-map2.png')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Overlay for gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1C2554]/60 via-[#1C2554]/95 to-[#BE965B]/40"></div>

            <div className="relative max-w-7xl mx-auto px-6 py-12">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* Logo & Description */}
                    <div className="flex flex-col items-start">
                        <img
                            src="https://ftsaero.com/wp-content/uploads/2023/06/fts-logo-gold-white.png"
                            alt="FTS Logo"
                            className="mb-4 w-32"
                        />
                        <h3 className="text-xl font-bold mb-2 text-[#BE965B]">Aviation Portal</h3>
                        <p className="text-gray-300">
                            Your trusted partner for aviation supplier management and connectivity.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-[#BE965B]">Quick Links</h4>
                        <div className="space-y-2">
                            {["Home", "About Us", "Services", "Contact"].map((item) => (
                                <p
                                    key={item}
                                    className="text-gray-300 hover:text-[#BE965B] cursor-pointer transition-colors duration-200"
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4 text-[#BE965B]">Support</h4>
                        <div className="space-y-2">
                            {["Help Center", "Terms of Service", "Privacy Policy", "FAQ"].map((item) => (
                                <p
                                    key={item}
                                    className="text-gray-300 hover:text-[#BE965B] cursor-pointer transition-colors duration-200"
                                >
                                    {item}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4 text-[#BE965B]">Contact Info</h4>
                        <div className="space-y-2 text-gray-300">
                            <p>Email: info@aviationportal.com</p>
                            <p>Phone: +1 (555) 123-4567</p>
                            <p>Address: 123 Aviation Ave, City</p>
                        </div>
                    </div>
                </div>

                {/* Divider & Bottom */}
                <div className="border-t border-[#BE965B]/90 pt-8 text-center text-gray-300">
                    <p className="text-lg font-semibold">
                        &copy; 2025 <span className="text-[#BE965B] font-semibold">Fuel Supplying Portal</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
