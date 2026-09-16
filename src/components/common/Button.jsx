import React from "react";

export const Button = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const baseStyle =
    "px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  const variants = {
    primary:
      "bg-[var(--theme-primary)] text-white hover:brightness-110 shadow-[var(--theme-primary)]/30",
    secondary: "bg-[#3D3D3D] text-white hover:bg-black shadow-gray-500/30",
    outline:
      "border-2 border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-green-500/30",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
