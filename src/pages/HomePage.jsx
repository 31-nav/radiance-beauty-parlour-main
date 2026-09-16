import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Star,
  Clock,
  Phone,
  MapPin,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Button from "../components/common/Button";
import { SkeletonCard } from "../components/common/Skeletons";
import { InstagramIcon } from "../components/common/Icons";
import StripeBanner from "../components/layout/StripeBanner";
import { useApp } from "../context/AppContext";
import {
  TEAM_MEMBERS,
  ICON_MAP,
  CONTACT_CONFIG,
} from "../config/constants";

import mainLogo from "../image/crop radiance logo.jpg";
import img1 from "../image/img 1.jpeg";
import img2 from "../image/img 2.jpeg";

const ServiceCard = ({
  iconName,
  title,
  price,
  description,
  onClick,
  isDarkMode,
}) => {
  const Icon = ICON_MAP[iconName] || Sparkles;
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300 border group h-full flex flex-col cursor-pointer transform hover:-translate-y-2 hover:bg-[var(--theme-primary)] ${
        isDarkMode
          ? "bg-[#2A2A2A] border-gray-700"
          : "bg-[#B8BC86] border-[#f0ebe0]"
      }`}
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors duration-300 shrink-0 ${
          isDarkMode ? "bg-gray-700" : "bg-[#F2F7F6]"
        }`}
      >
        <Icon
          className="text-[var(--theme-primary)] group-hover:text-[var(--theme-primary)] transition-colors duration-300"
          size={24}
        />
      </div>
      <h3
        className={`text-xl font-serif font-bold mb-2 group-hover:text-white transition-colors ${
          isDarkMode ? "text-white" : "text-[#3D3D3D]"
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-sm mb-3 flex-grow group-hover:text-white/90 transition-colors line-clamp-3 ${
          isDarkMode ? "text-gray-300" : "text-gray-500"
        }`}
      >
        {description}
      </p>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-transparent group-hover:border-white/20">
        <div className="text-[#B83C08] font-bold group-hover:text-yellow-300 transition-colors">
          {price}
        </div>
        <div className="text-xs text-[#B83C08] font-bold group-hover:translate-x-1 transition-transform group-hover:text-white flex items-center">
          View <ArrowLeft className="rotate-180 ml-1 w-3 h-3" />
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const {
    services,
    loadingServices,
    galleryCategories,
    siteConfig,
    isDarkMode,
    setIsBookingOpen,
    queryForm,
    setQueryForm,
    handleQuerySubmit,
  } = useApp();

  const [serviceCategory, setServiceCategory] = useState("all");
  const [showAllServices, setShowAllServices] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Support smooth scrolling when navigated with hash
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const activeServices = services.filter(
    (s) =>
      !s.isHidden &&
      (serviceCategory === "all" || s.category === serviceCategory)
  );

  const displayedServices = showAllServices
    ? activeServices
    : activeServices.slice(0, 6);

  const dynamicTeam = TEAM_MEMBERS.map((member) => {
    if (member.name.includes("Rupa") && siteConfig?.expertRupa)
      return { ...member, image: siteConfig.expertRupa };
    if (member.name.includes("Anupa") && siteConfig?.expertAnupa)
      return { ...member, image: siteConfig.expertAnupa };
    return member;
  });

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-2/3 md:w-1/3 h-full bg-[var(--theme-primary)]/10 -z-10 rounded-l-[100px]"></div>
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 animate-fade-in-up order-2 md:order-1 text-center md:text-left">
            <div className="inline-block px-4 py-1 bg-[#FFD700]/10 text-[#B8860B] border border-[#FFD700]/50 rounded-full text-xs md:text-sm font-bold tracking-wider mb-2">
              WELCOME TO RADIANCE
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight ${
                isDarkMode ? "text-white" : "text-[#3D3D3D]"
              }`}
            >
              Reveal Your Inner{" "}
              <span className="text-[var(--theme-primary)]">Glow</span> & Beauty
            </h1>
            <p
              className={`text-sm leading-relaxed md:text-lg md:leading-normal max-w-[90%] md:max-w-lg mx-auto md:mx-0 ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Experience the art of beauty with our premium makeup, hair
              styling, and spa services designed to make you shine on your
              special days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button
                variant="primary"
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto"
              >
                Book Now
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/store")}
                className="w-full sm:w-auto"
              >
                Visit Product Store
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center order-1 md:order-2">
            <div className="relative">
              {/* Rotating Logo Rings */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[var(--theme-secondary)] animate-spin-slow opacity-60"></div>
              <div
                className="absolute -inset-2 rounded-full border border-dashed border-[var(--theme-primary)] animate-spin-slow"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "12s",
                }}
              ></div>

              <div
                className={`w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-[8px] md:border-[12px] shadow-2xl overflow-hidden relative flex items-center justify-center z-10 ${
                  isDarkMode
                    ? "border-gray-800 bg-gray-800"
                    : "border-white bg-[#F9F7F2]"
                }`}
              >
                <img
                  src={mainLogo}
                  alt="Radiance Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div
              className={`absolute -bottom-4 right-10 md:right-auto md:-left-4 p-1.5 md:p-3 scale-85 md:scale-100 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow max-w-[150px] z-20 ${
                isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
              }`}
            >
              <div className="bg-[#5CFF5C] p-2 rounded-full text-white">
                <Star size={16} fill="currentColor" />
              </div>
              <div className="text-left scale-90 md:scale-100">
                <p
                  className={`font-bold text-sm ${
                    isDarkMode ? "text-white" : "text-[#3D3D3D]"
                  }`}
                >
                  4.9 Rating
                </p>
                <p className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">
                  From Happy Clients
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement Stripe Banner */}
      {siteConfig?.showAnnouncement && (
        <StripeBanner text={siteConfig.announcementText} />
      )}

      {/* Services Section */}
      <section
        id="services"
        className={`py-16 md:py-20 ${isDarkMode ? "bg-[#1A1A1A]" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2
              className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-[#3D3D3D]"
              }`}
            >
              Our Services
            </h2>
            <div className="w-24 h-1 bg-[var(--theme-secondary)] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-sm md:text-gray-600 md:text-base mt-2 md:mt-3 text-center">
              Click on any service to see our work gallery.
            </p>
          </div>

          {/* Category Filters */}
          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 md:gap-4 mb-10 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {["all", ...galleryCategories].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setServiceCategory(filter);
                  setShowAllServices(false);
                }}
                className={`whitespace-nowrap px-5 py-2 rounded-full capitalize font-medium transition-all text-sm md:text-base ${
                  serviceCategory === filter
                    ? "bg-[var(--theme-primary)] text-white shadow-lg transform scale-105"
                    : isDarkMode
                    ? "bg-[#2A2A2A] text-gray-300 hover:bg-gray-700 border-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter === "all" ? "All Services" : filter}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {loadingServices ? (
              Array(6)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
            ) : displayedServices.length > 0 ? (
              displayedServices.map((s) => (
                <ServiceCard
                  key={s.id}
                  {...s}
                  onClick={() => navigate(`/gallery?service=${s.id}`)}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-400 py-10">
                No services available in this category.
              </p>
            )}
          </div>

          {activeServices.length > 6 && !loadingServices && (
            <div className="mt-12 text-center">
              <Button
                variant="outline"
                onClick={() => setShowAllServices(!showAllServices)}
                className="min-w-[200px]"
              >
                {showAllServices ? (
                  <>
                    Show Less <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    View All Services ({activeServices.length}){" "}
                    <ChevronDown size={16} />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 md:py-20 bg-[var(--theme-primary)] text-white"
      >
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
              Why Choose Radiance?
            </h2>
            <p className="mb-6 opacity-90 text-sm leading-relaxed md:text-lg md:leading-normal max-w-[90%] md:max-w-xl mx-auto md:mx-0">
              At Radiance Beauty Parlour, beauty is more than just skin deep. We
              combine traditional techniques with modern style to give you the
              perfect look.
            </p>
            <ul className="space-y-4">
              {[
                "Certified Experts",
                "Premium Products",
                "Hygienic Environment",
                "Customized Care",
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm"
                >
                  <div className="bg-white text-[var(--theme-primary)] p-1 rounded-full">
                    <CheckCircle size={16} />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
            <img
              src={img2}
              alt="Radiance Beauty Parlour treatment"
              className="rounded-2xl transform translate-y-8 shadow-xl w-full h-auto border-2 border-[#E8A336]"
            />
            <img
              src={img1}
              alt="Radiance Beauty Parlour makeup styling"
              className="rounded-2xl transform translate-y-8 shadow-xl w-full h-auto border-2 border-[#E8A336]"
            />
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section
        className={`py-16 md:py-20 ${
          isDarkMode ? "bg-[#121212]" : "bg-[#FDFBF7]"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2
              className={`text-3xl font-serif font-bold ${
                isDarkMode ? "text-white" : "text-[#3D3D3D]"
              }`}
            >
              Meet Our Experts
            </h2>
            <p className="text-gray-500 text-sm md:text-gray-600 md:text-base mt-1 md:mt-2 text-center">
              The magic hands behind your glow
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {dynamicTeam.map((member, i) => (
              <div
                key={i}
                className={`p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6 border hover:shadow-xl transition-shadow text-center sm:text-left ${
                  isDarkMode
                    ? "bg-[#2A2A2A] border-gray-700"
                    : "bg-white border-gray-100"
                }`}
              >
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 rounded-full border border-dashed border-[var(--theme-primary)] animate-spin-slow"></div>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-[#F2F7F6] relative z-10"
                  />
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      isDarkMode ? "text-white" : "text-[#3D3D3D]"
                    }`}
                  >
                    {member.name}
                  </h3>
                  <p className="text-[var(--theme-primary)] font-medium">
                    {member.role}
                  </p>
                  <p
                    className={`text-sm mt-2 flex items-center justify-center sm:justify-start gap-1 px-3 py-1 rounded-full ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    <Star
                      size={14}
                      className="text-[var(--theme-secondary)] fill-current"
                    />{" "}
                    {member.certification}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Query Section */}
      <section
        id="contact"
        className={`py-12 md:py-20 ${isDarkMode ? "bg-[#1A1A1A]" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-12 shadow-2xl rounded-3xl overflow-hidden border ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            {/* Contact Info */}
            <div className="p-8 md:p-14 bg-[#3D3D3D] text-white">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Clock className="text-[var(--theme-secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Operating Hours</h3>
                    <p className="opacity-80 font-mono text-sm">
                      Monday - Sunday
                    </p>
                    <p className="text-[var(--theme-secondary)] font-bold text-sm md:text-base leading-relaxed">
                      {CONTACT_CONFIG.hours}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {CONTACT_CONFIG.days}
                    </p>
                  </div>
                </div>

                {/* Call Us */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <Phone className="text-[var(--theme-secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Call Us</h3>
                    <a
                      href={`tel:${CONTACT_CONFIG.phone}`}
                      className="opacity-80 font-mono text-sm hover:text-[var(--theme-secondary)] block"
                    >
                      {CONTACT_CONFIG.phone}
                    </a>
                    <a
                      href={`tel:${CONTACT_CONFIG.phoneSecondary}`}
                      className="opacity-80 font-mono text-sm hover:text-[var(--theme-secondary)] block"
                    >
                      {CONTACT_CONFIG.phoneSecondary}
                    </a>
                  </div>
                </div>

                {/* Visit Us */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <MapPin className="text-[var(--theme-secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Visit Us</h3>
                    <a
                      href={CONTACT_CONFIG.locationMapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:text-[var(--theme-secondary)] block text-sm"
                    >
                      {CONTACT_CONFIG.locationName} <br />
                      {CONTACT_CONFIG.locationAddress}
                      <span className="block text-xs text-[var(--theme-secondary)] mt-1 underline">
                        Get Directions
                      </span>
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    <InstagramIcon className="text-[var(--theme-secondary)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Follow Us</h3>
                    <a
                      href={CONTACT_CONFIG.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:text-[var(--theme-secondary)] block text-sm"
                    >
                      {CONTACT_CONFIG.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Query Form */}
            <div
              className={`p-8 md:p-14 ${
                isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
              }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-serif font-bold mb-6 ${
                  isDarkMode ? "text-white" : "text-[#3D3D3D]"
                }`}
              >
                Ask Queries
              </h2>

              <form className="space-y-4" onSubmit={handleQuerySubmit}>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  value={queryForm.name}
                  onChange={(e) =>
                    setQueryForm({ ...queryForm, name: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)] ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-[#F9F7F2]"
                  }`}
                />

                <input
                  required
                  type="tel"
                  placeholder="Phone Number"
                  value={queryForm.phone}
                  onChange={(e) =>
                    setQueryForm({ ...queryForm, phone: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)] ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-[#F9F7F2]"
                  }`}
                />

                <textarea
                  required
                  rows="4"
                  placeholder={`Your Message...\nWe will reply via Whatsapp.`}
                  value={queryForm.message}
                  onChange={(e) =>
                    setQueryForm({ ...queryForm, message: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)] placeholder:text-[12px] md:placeholder:text-sm ${
                    isDarkMode
                      ? "bg-gray-700 text-white placeholder-gray-400"
                      : "bg-[#F9F7F2]"
                  }`}
                ></textarea>

                <Button className="w-full">Send Message</Button>

                <h6 className="text-xs text-gray-400 mt-2">
                  * We respect your privacy and will not share your information.
                </h6>
                <h6 className="text-xs text-gray-400 mt-2">
                  * For urgent inquiries, please call us directly.
                </h6>
                <h6 className="text-xs text-gray-400 mt-2">
                  * We aim to respond within 24 hours on business days.
                </h6>
                <h6 className="text-xs text-gray-400 mt-2">
                  * Follow us on Instagram for latest update and offers.
                </h6>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
