import React from "react";
import { AlertCircle, CheckCircle, X } from "lucide-react";

export const NotificationToast = ({ message, type, onClose }) => {
  if (!message) return null;
  const bgColor = type === "error" ? "bg-red-500" : "bg-[var(--theme-primary)]";
  const Icon = type === "error" ? AlertCircle : CheckCircle;

  return (
    <div
      className={`fixed top-24 right-4 z-[60] ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-down`}
    >
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-80 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

export default NotificationToast;
