import React, { useEffect } from "react";
import { Megaphone, X } from "lucide-react";

export const AnnouncementPopup = ({ config, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible || !config?.showAnnouncement) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 z-[70] animate-fade-in-up">
      <div className="bg-[#3D3D3D] text-white p-4 rounded-xl shadow-2xl border-l-4 border-[var(--theme-secondary)] flex items-start gap-3 relative">
        <div className="bg-white/10 p-2 rounded-full shrink-0">
          <Megaphone size={20} className="text-[var(--theme-secondary)]" />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="font-bold text-[var(--theme-secondary)] text-xs uppercase tracking-wider mb-1">
            Latest Update
          </h4>
          <p className="text-sm leading-snug font-medium opacity-95">
            {config.announcementText || "Welcome to Radiance Beauty Parlour!"}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close Announcement"
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementPopup;
