import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import Button from "../common/Button";
import { useApp } from "../../context/AppContext";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    isDarkMode,
    toggleTheme,
    setIsBookingOpen,
    showInstallBanner,
    handleInstallClick,
  } = useApp();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSectionClick = (sectionId) => {
    setIsMenuOpen(false);
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-40 transition-all duration-300 ${
        scrolled
          ? isDarkMode
            ? "bg-[#1A1A1A]/95 shadow-md shadow-gray-900 py-2 top-0"
            : "bg-white/95 shadow-md py-2 top-0"
          : "bg-transparent py-4 top-0"
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-[var(--theme-secondary)] bg-[#1a1a1a] shadow-lg">
            <img
              src="/logo.png"
              alt="Radiance Logo"
              className="w-7 h-7 object-contain"
            />
          </div>
          <span
            className={`text-2xl font-serif font-bold tracking-tight ${
              isDarkMode ? "text-white" : "text-[#3D3D3D]"
            }`}
          >
            Radiance
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`font-medium transition-colors ${
              isActive("/")
                ? "text-[var(--theme-primary)]"
                : isDarkMode
                ? "text-gray-300 hover:text-[var(--theme-primary)]"
                : "text-gray-600 hover:text-[var(--theme-primary)]"
            }`}
          >
            Home
          </Link>

          <button
            onClick={() => handleSectionClick("about")}
            className={`font-medium transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:text-[var(--theme-primary)]"
                : "text-gray-600 hover:text-[var(--theme-primary)]"
            }`}
          >
            About Us
          </button>

          <Link
            to="/gallery"
            className={`font-medium transition-colors ${
              isActive("/gallery")
                ? "text-[var(--theme-primary)]"
                : isDarkMode
                ? "text-gray-300 hover:text-[var(--theme-primary)]"
                : "text-gray-600 hover:text-[var(--theme-primary)]"
            }`}
          >
            Gallery
          </Link>

          <Link
            to="/store"
            className={`font-medium transition-colors ${
              isActive("/store")
                ? "text-[var(--theme-primary)]"
                : isDarkMode
                ? "text-gray-300 hover:text-[var(--theme-primary)]"
                : "text-gray-600 hover:text-[var(--theme-primary)]"
            }`}
          >
            Product Store
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-yellow-400 hover:bg-gray-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Button
            variant="primary"
            className="px-4 py-1.5 text-sm"
            onClick={() => setIsBookingOpen(true)}
          >
            Book Appointment
          </Button>
        </div>

        {/* Mobile Header Icons */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className={`p-2 rounded-full transition-colors ${
              isDarkMode
                ? "bg-gray-700 text-yellow-400"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className={isDarkMode ? "text-white" : "text-[#3D3D3D]"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div
          className={`md:hidden border-t absolute w-full shadow-lg ${
            isDarkMode
              ? "bg-[#1A1A1A] border-gray-800"
              : "bg-white border-gray-100"
          }`}
        >
          <div className="flex flex-col p-6 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-left font-medium ${
                isActive("/") ? "text-[var(--theme-primary)] font-bold" : isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Home
            </Link>

            <button
              onClick={() => handleSectionClick("about")}
              className={`text-left font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              About Us
            </button>

            <Link
              to="/gallery"
              onClick={() => setIsMenuOpen(false)}
              className={`text-left font-medium ${
                isActive("/gallery") ? "text-[var(--theme-primary)] font-bold" : isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Gallery
            </Link>

            <Link
              to="/store"
              onClick={() => setIsMenuOpen(false)}
              className={`text-left font-medium ${
                isActive("/store") ? "text-[var(--theme-primary)] font-bold" : isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Product Store
            </Link>

            <button
              onClick={() => {
                setIsBookingOpen(true);
                setIsMenuOpen(false);
              }}
              className="text-left font-bold text-[var(--theme-primary)]"
            >
              Book Appointment
            </button>

            {showInstallBanner && (
              <button
                onClick={() => {
                  handleInstallClick();
                  setIsMenuOpen(false);
                }}
                className="text-left font-bold text-[#B3121A] flex items-center gap-2 mt-2 pt-4 border-t border-dashed border-gray-300/50"
              >
                <div className="bg-[var(--theme-secondary)]/10 p-1.5 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
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
                Install App
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
