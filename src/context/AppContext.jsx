import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  signInWithCustomToken,
} from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, ADMIN_UID } from "../config/firebase";
import {
  THEMES,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SERVICES,
  INITIAL_GALLERY,
} from "../config/constants";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Theme & Dark Mode
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  // Modals & Popups
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
    isVisible: false,
  });

  // Query Form State
  const [queryForm, setQueryForm] = useState({
    name: "",
    phone: "",
    message: "",
  });

  // Data Collections
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [categoriesDocs, setCategoriesDocs] = useState([]);
  const [galleryCategories, setGalleryCategories] = useState(INITIAL_CATEGORIES);
  const [messages, setMessages] = useState([]);
  const [siteConfig, setSiteConfig] = useState({});

  // Loading States
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);

  // Auth
  const [user, setUser] = useState(null);

  // Inquiry Cart / Bag
  const [cart, setCart] = useState([]);

  // PWA Install
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Initialize Dark Mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  // Dynamic Theme CSS variables
  useEffect(() => {
    const themeId = siteConfig?.themeId || "default";
    const theme = THEMES.find((t) => t.id === themeId) || THEMES[0];
    setActiveTheme(theme);

    const root = document.documentElement;
    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-secondary", theme.secondary);
    root.style.setProperty(
      "transition",
      "background-color 0.5s ease, color 0.5s ease"
    );
  }, [siteConfig?.themeId]);

  // Notifications
  const showNotification = (msg, type = "success") => {
    setNotification({ message: msg, type, isVisible: true });
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 3000);
  };

  const hideNotification = () => {
    setNotification((prev) => ({ ...prev, isVisible: false }));
  };

  // Cart operations
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    showNotification(`${product.name} added to inquiry bag!`, "success");
  };

  const removeFromCart = (index) => {
    setCart((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Query Submit
  const handleQuerySubmit = async (e, customData = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const dataToSend = customData || queryForm;

    try {
      const messageWithPrefix = `Inquiry: ${dataToSend.message}`;
      await addDoc(collection(db, "messages"), {
        name: dataToSend.name,
        phone: dataToSend.phone,
        message: messageWithPrefix,
        isRead: false,
        isReplied: false,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString(),
      });
      if (!customData) {
        setQueryForm({ name: "", phone: "", message: "" });
      }
      showNotification("Query sent successfully!", "success");
      return true;
    } catch (error) {
      console.error("Query submit error:", error);
      showNotification("Error sending message.", "error");
      return false;
    }
  };

  // Firestore & Auth Listeners
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (
          typeof window.__initial_auth_token !== "undefined" &&
          window.__initial_auth_token
        ) {
          await signInWithCustomToken(auth, window.__initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn("Auth initialization warning:", e);
      }
    };
    initAuth();

    const unsubAuth = onAuthStateChanged(auth, setUser);

    const unsubProducts = onSnapshot(collection(db, "products"), (s) => {
      setProducts(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingProducts(false);
    });

    const unsubServices = onSnapshot(collection(db, "services"), (s) => {
      setServices(s.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingServices(false);
    });

    const unsubGallery = onSnapshot(
      query(collection(db, "gallery"), orderBy("order", "asc")),
      (s) => {
        setGallery(s.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingGallery(false);
      }
    );

    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), orderBy("createdAt", "desc")),
      (s) => setMessages(s.docs.map((d) => ({ id: d.id, ...d.data() })))
    );

    const unsubCategories = onSnapshot(collection(db, "categories"), (s) => {
      const docs = s.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategoriesDocs(docs);
      const cats = docs.map((d) => d.name);
      setGalleryCategories(["Bridal", "Hair", "Skin", ...cats]);
    });

    const unsubConfig = onSnapshot(doc(db, "site_settings", "config"), (d) => {
      if (d.exists()) setSiteConfig(d.data());
    });

    return () => {
      unsubAuth();
      unsubProducts();
      unsubServices();
      unsubGallery();
      unsubMessages();
      unsubCategories();
      unsubConfig();
    };
  }, []);

  // PWA Install Handlers
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        activeTheme,
        isBookingOpen,
        setIsBookingOpen,
        isQueryModalOpen,
        setIsQueryModalOpen,
        showAnnouncement,
        setShowAnnouncement,
        notification,
        showNotification,
        hideNotification,
        queryForm,
        setQueryForm,
        handleQuerySubmit,
        products,
        setProducts,
        services,
        setServices,
        gallery,
        setGallery,
        categoriesDocs,
        galleryCategories,
        setGalleryCategories,
        messages,
        setMessages,
        siteConfig,
        loadingProducts,
        loadingServices,
        loadingGallery,
        user,
        ADMIN_UID,
        cart,
        setCart,
        addToCart,
        removeFromCart,
        showInstallBanner,
        setShowInstallBanner,
        handleInstallClick,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;
