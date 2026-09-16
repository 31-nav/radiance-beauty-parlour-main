import React, { useState } from "react";
import { Calendar, X, MessageCircle } from "lucide-react";
import Button from "../common/Button";
import { CONTACT_CONFIG } from "../../config/constants";

export const BookingModal = ({ isOpen, onClose, services, isDarkMode }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    service: "",
    date: "",
    time: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.service ||
      !formData.date ||
      !formData.time
    ) {
      alert("Please fill all fields");
      return;
    }
    const text = `*New Booking Request* 📅\n\n*Name:* ${formData.name}\n*Service:* ${formData.service}\n*Date:* ${formData.date}\n*Preferred Time:* ${formData.time}\n\nPlease confirm my appointment.`;
    window.open(
      `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
    onClose();
  };

  const today = new Date().toISOString().split("T")[0];
  const inputClass = `w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] outline-none ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-gray-50 border-gray-200"
  }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up ${
          isDarkMode ? "bg-[#2A2A2A] text-white" : "bg-white"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[var(--theme-primary)] p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Calendar size={20} /> Book Appointment
          </h3>
          <button onClick={onClose} aria-label="Close booking modal">
            <X size={20} className="hover:rotate-90 transition-transform" />
          </button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              className={`block text-sm font-bold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Your Name
            </label>
            <input
              required
              type="text"
              className={inputClass}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-bold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Select Service
            </label>
            <select
              required
              className={inputClass}
              value={formData.service}
              onChange={(e) =>
                setFormData({ ...formData, service: e.target.value })
              }
            >
              <option value="">-- Choose a Service --</option>
              {services &&
                services.map((s) => (
                  <option key={s.id} value={s.title}>
                    {s.title}
                  </option>
                ))}
              <option value="General Inquiry">Other / General Inquiry</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className={`block text-sm font-bold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Date
              </label>
              <input
                required
                type="date"
                min={today}
                className={inputClass}
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <label
                className={`block text-sm font-bold mb-1 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Time
              </label>
              <input
                required
                type="time"
                className={inputClass}
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>
          <div className="pt-2">
            <Button variant="whatsapp" className="w-full justify-center">
              <MessageCircle size={18} /> Book via WhatsApp
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">
              This will open WhatsApp to send your details.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
