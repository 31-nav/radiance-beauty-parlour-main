import React from "react";
import { X } from "lucide-react";

export const InstallBanner = ({ onInstall, onClose, isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-[60] animate-fade-in-up">
      <button
        onClick={onInstall}
        className="bg-[#B3121A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 hover:bg-[#d48e24] transition-colors border-2 border-white/20"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div className="text-left">
          <p className="font-bold text-sm leading-none">Install App</p>
          <p className="text-[10px] opacity-90 mt-0.5">Add to Home Screen</p>
        </div>
        <X
          size={16}
          className="ml-2 opacity-60 hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        />
      </button>
    </div>
  );
};

export default InstallBanner;
