import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";

// Layout & Modals
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import FloatingActionMenu from "./components/layout/FloatingActionMenu";
import FallingOverlay from "./components/layout/FallingOverlay";
import BookingModal from "./components/modals/BookingModal";
import QueryModal from "./components/modals/QueryModal";
import NotificationToast from "./components/modals/NotificationToast";
import AnnouncementPopup from "./components/modals/AnnouncementPopup";
import InstallBanner from "./components/modals/InstallBanner";

// Lazy-loaded route pages for code-splitting and low cache/memory usage
const HomePage = lazy(() => import("./pages/HomePage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const StorePage = lazy(() => import("./pages/StorePage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));

// Auto-scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Global Shell containing Modals, Navigation and Route Views
function AppShell() {
  const {
    isDarkMode,
    activeTheme,
    isBookingOpen,
    setIsBookingOpen,
    isQueryModalOpen,
    setIsQueryModalOpen,
    showAnnouncement,
    setShowAnnouncement,
    siteConfig,
    services,
    notification,
    hideNotification,
    queryForm,
    setQueryForm,
    handleQuerySubmit,
    showInstallBanner,
    setShowInstallBanner,
    handleInstallClick,
  } = useApp();

  const location = useLocation();

  // Show announcement popup on home view after 1s if not dismissed in session
  useEffect(() => {
    if (location.pathname === "/" && siteConfig?.showAnnouncement) {
      const hasSeen = sessionStorage.getItem("seenBanner");
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowAnnouncement(true);
          sessionStorage.setItem("seenBanner", "true");
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [location.pathname, siteConfig?.showAnnouncement, setShowAnnouncement]);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-300 relative ${
        isDarkMode ? "bg-[#121212] text-gray-100" : "bg-[#FDFBF7] text-gray-800"
      }`}
    >
      <ScrollToTop />

      {/* Ambient Falling Effect */}
      <FallingOverlay icon={activeTheme.icon} />

      {/* Top Navigation */}
      <Navbar />

      {/* Floating Action Menu & Query Modal */}
      <FloatingActionMenu
        onOpenQuery={() => setIsQueryModalOpen(true)}
        isDarkMode={isDarkMode}
      />

      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        formData={queryForm}
        setFormData={setQueryForm}
        onSubmit={handleQuerySubmit}
        isDarkMode={isDarkMode}
      />

      {/* Global Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        services={services}
        isDarkMode={isDarkMode}
      />

      {/* Global Notification Toast */}
      {notification.isVisible && (
        <NotificationToast
          message={notification.message}
          type={notification.type}
          onClose={hideNotification}
        />
      )}

      {/* Announcement Popup */}
      <AnnouncementPopup
        config={siteConfig}
        isVisible={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
      />

      {/* PWA Install Banner */}
      <InstallBanner
        isDarkMode={isDarkMode}
        isVisible={showInstallBanner}
        onInstall={handleInstallClick}
        onClose={() => setShowInstallBanner(false)}
      />

      {/* Route Views with Suspense loading */}
      <main className="min-h-[calc(100vh-200px)]">
        <Suspense
          fallback={
            <div className="pt-32 pb-20 flex flex-col items-center justify-center min-h-[60vh]">
              <div className="w-12 h-12 rounded-full border-4 border-[var(--theme-primary)] border-t-transparent animate-spin"></div>
              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading Radiance...
              </p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </Router>
  );
}
