import React from "react";
import { Info, X } from "lucide-react";
import Button from "../common/Button";

export const QueryModal = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  const inputClass = `w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-gray-50 border-gray-200"
  }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
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
            <Info size={20} /> Ask a Query
          </h3>
          <button
            onClick={onClose}
            className="hover:rotate-90 transition-transform"
            aria-label="Close query modal"
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            onSubmit(e);
            onClose();
          }}
        >
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">
              Your Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Priya Sharma"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">
              Phone Number
            </label>
            <input
              required
              type="tel"
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">
              Question / Message
            </label>
            <textarea
              required
              rows="4"
              placeholder="How can we help you?"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              className={inputClass}
            ></textarea>
          </div>

          <Button className="w-full">Send Message</Button>
          <p className="text-xs text-center opacity-60">
            We will reply via WhatsApp shortly.
          </p>
        </form>
      </div>
    </div>
  );
};

export default QueryModal;
