import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Camera, X } from "lucide-react";
import { SkeletonImage } from "../components/common/Skeletons";
import { useApp } from "../context/AppContext";

export const GalleryPage = () => {
  const {
    gallery,
    galleryCategories,
    services,
    loadingGallery,
    isDarkMode,
  } = useApp();

  const [searchParams, setSearchParams] = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [galleryFilter, setGalleryFilter] = useState(serviceParam || "all");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (serviceParam) {
      setGalleryFilter(serviceParam);
    }
  }, [serviceParam]);

  // Check if current filter is a Service ID
  const activeService = services.find((s) => s.id === galleryFilter);

  const displayedImages = gallery.filter((img) => {
    if (img.isHidden) return false;

    // If filter is a service ID, show images for that specific service
    if (activeService) {
      return img.serviceId === activeService.id;
    }

    // Otherwise show by category
    return galleryFilter === "all" || img.category === galleryFilter;
  });

  const handleResetFilter = () => {
    setGalleryFilter("all");
    setSearchParams({});
  };

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="container mx-auto relative">
        {/* Back to Home Button */}
        <Link
          to="/"
          className={`absolute top-0 left-0 flex items-center gap-2 text-sm font-medium hover:underline z-10 ${
            isDarkMode
              ? "text-gray-300 hover:text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        <div className="text-center mb-8 pt-8 md:pt-0">
          <h2
            className={`text-4xl font-serif font-bold ${
              isDarkMode ? "text-white" : "text-[#3D3D3D]"
            }`}
          >
            Our Gallery
          </h2>
          {activeService ? (
            <div className="mt-2 flex flex-col items-center animate-fade-in">
              <span className="bg-[var(--theme-primary)] text-white px-3 py-1 rounded-full text-sm font-medium mb-2">
                Service: {activeService.title}
              </span>
              <button
                onClick={handleResetFilter}
                className="text-sm underline hover:text-[var(--theme-primary)] flex items-center gap-1"
              >
                <ArrowLeft size={14} /> Back to All Photos
              </button>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">A glimpse of our finest work</p>
          )}
        </div>

        {/* Gallery Tabs - Hide if viewing specific service */}
        {!activeService && (
          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 md:gap-4 mb-12 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {["all", ...galleryCategories].map((filter) => (
              <button
                key={filter}
                onClick={() => setGalleryFilter(filter)}
                className={`whitespace-nowrap flex-shrink-0 px-6 py-2 rounded-full capitalize font-medium transition-all text-sm md:text-base ${
                  galleryFilter === filter
                    ? "bg-[var(--theme-primary)] text-white shadow-lg transform scale-105"
                    : isDarkMode
                    ? "bg-[#2A2A2A] text-gray-300 hover:bg-gray-700 border-gray-700"
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                {filter === "all" ? "All Photos" : `${filter} Services`}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {loadingGallery ? (
            Array(6)
              .fill(0)
              .map((_, i) => <SkeletonImage key={i} isDarkMode={isDarkMode} />)
          ) : displayedImages.length > 0 ? (
            displayedImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`group relative aspect-square overflow-hidden rounded-2xl shadow-md cursor-zoom-in ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.category || "Gallery work"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <Camera size={48} className="mx-auto mb-4 opacity-50" />
              <p>
                No images found{" "}
                {activeService ? `for ${activeService.title}` : "yet"}.
              </p>
              {activeService && (
                <button
                  onClick={handleResetFilter}
                  className="mt-4 text-[var(--theme-primary)] underline"
                >
                  View All Gallery
                </button>
              )}
            </div>
          )}
        </div>

        {/* Gallery Lightbox (Full Screen Zoom) */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <button
              aria-label="Close Lightbox"
              className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20"
            >
              <X size={28} />
            </button>
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.category}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="mt-4 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium border border-white/10">
                {selectedImage.serviceName || selectedImage.category} Service
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryPage;
