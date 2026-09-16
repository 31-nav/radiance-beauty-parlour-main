import React from "react";
import { Link } from "react-router-dom";
import { Heart, User } from "lucide-react";
import { InstagramIcon, FacebookIcon } from "../common/Icons";
import { CONTACT_CONFIG } from "../../config/constants";
import { useApp } from "../../context/AppContext";

export const Footer = () => {
  const { isDarkMode } = useApp();

  return (
    <footer
      className={`py-8 md:py-12 border-t ${
        isDarkMode
          ? "bg-[#0A0A0A] border-gray-800"
          : "bg-[#2D2D2D] border-gray-700"
      } text-white`}
    >
      <div className="container mx-auto px-6 text-center">
        <div className="mb-6 flex justify-center gap-6">
          <a
            href={CONTACT_CONFIG.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="hover:text-[var(--theme-secondary)] transition-colors"
          >
            <InstagramIcon />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:text-[var(--theme-secondary)] transition-colors"
          >
            <FacebookIcon />
          </a>
        </div>
        <p className="text-gray-400 mb-2 text-[10px] xs:text-xs sm:text-sm">
          © 2025-26 Radiance Beauty Parlour. All rights reserved.
        </p>
        <Link
          to="/admin"
          className="text-xs text-gray-400 hover:text-white flex items-center justify-center gap-1 mx-auto transition-colors"
        >
          <User size={12} /> Admin Login
        </Link>
        <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
          Designed with{" "}
          <Heart
            size={12}
            className="text-red-500 fill-red-500 animate-pulse"
          />{" "}
          by{" "}
          <a
            href="https://www.instagram.com/navneet_singh.31/"
            target="_blank"
            rel="noreferrer"
            className="text-[#FFD700] hover:underline font-bold"
          >
            Nav
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
