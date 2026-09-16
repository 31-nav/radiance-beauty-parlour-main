import React, { useState } from "react";
import { Info, MessageCircle, MapPin, Phone, Plus } from "lucide-react";
import { CONTACT_CONFIG } from "../../config/constants";

export const FloatingActionMenu = ({ onOpenQuery, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const btnBase = "flex items-center group decoration-none";
  const labelBase = `mr-3 px-3 py-1 text-xs font-medium rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-slate-700"
  }`;
  const iconBase = `w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors border ${
    isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
  }`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none">
      {/* Child Buttons Container */}
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col items-end space-y-3 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 translate-y-10 scale-90 pointer-events-none"
        }`}
      >
        {/* 1. Ask Queries */}
        <button
          onClick={() => {
            onOpenQuery();
            setIsOpen(false);
          }}
          className={btnBase}
          aria-label="Ask Queries"
        >
          <span className={labelBase}>Ask Queries</span>
          <div
            className={`${iconBase} text-orange-500 hover:bg-orange-50 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <Info size={20} />
          </div>
        </button>

        {/* 2. WhatsApp */}
        <a
          href={`https://wa.me/${CONTACT_CONFIG.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className={btnBase}
          aria-label="Chat on WhatsApp"
        >
          <span className={labelBase}>WhatsApp</span>
          <div
            className={`${iconBase} text-green-500 hover:bg-green-50 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <MessageCircle size={20} />
          </div>
        </a>

        {/* 3. Location */}
        <a
          href={CONTACT_CONFIG.locationMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={btnBase}
          aria-label="Our Location"
        >
          <span className={labelBase}>Location</span>
          <div
            className={`${iconBase} text-blue-500 hover:bg-blue-50 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <MapPin size={20} />
          </div>
        </a>

        {/* 4. Call */}
        <a
          href={`tel:${CONTACT_CONFIG.phone}`}
          className={btnBase}
          aria-label="Call Us"
        >
          <span className={labelBase}>Call Now</span>
          <div
            className={`${iconBase} text-red-500 hover:bg-red-50 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <Phone size={20} />
          </div>
        </a>
      </div>

      {/* Parent Toggle Button */}
      <button
        onClick={toggleMenu}
        aria-label="Toggle Quick Actions"
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 pointer-events-auto ${
          isOpen ? "bg-red-500 rotate-45" : "bg-[var(--theme-primary)] rotate-0"
        }`}
        style={{ boxShadow: `0 4px 14px 0 var(--theme-primary)` }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default FloatingActionMenu;
