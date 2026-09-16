import React, { useState, useEffect, useRef } from 'react';
import {
  Menu, X, Star, MapPin, Phone, Clock, Scissors, Sparkles, Heart, ShoppingBag, Search,
  User, MessageCircle, Plus, Trash2, LogOut, Eye, EyeOff, Camera, CheckCircle, Image as ImageIcon, ArrowLeft, ChevronDown, ChevronUp, AlertCircle, Megaphone, Calendar, Pencil, Ban, Sun, Moon,
  GripVertical, CheckCheck, Upload, Palette, Droplets, Flower, Coffee, CloudRain, Info, CornerUpLeft
} from 'lucide-react';

// NOTE: I have commented out the local import to prevent the preview from crashing.
// Uncomment the line below when running on your local machine with the file present.
import mainLogo from './image/crop radiance logo.jpg';
// const mainLogo = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400"; // Placeholder for preview

import img1 from "./image/img 1.jpeg"; import img2 from "./image/img 2.jpeg";


// --- Local Icon Components (Fallbacks for reliability) ---
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const CheckCheckIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 7 17l-5-5" />
    <path d="m22 10-7.5 7.5L13 16" />
  </svg>
);

const UploadIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

// --- Firebase Imports ---
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithCustomToken,
  signInAnonymously
} from "firebase/auth";
import {
  getFirestore, collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot, query, orderBy, serverTimestamp, setDoc, writeBatch
} from "firebase/firestore";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyDTBE3AKFBvrBz_zWhzhVdNTK_nUWihw1k",
  authDomain: "radiance-beauty-67cc0.firebaseapp.com",
  projectId: "radiance-beauty-67cc0",
  storageBucket: "radiance-beauty-67cc0.firebasestorage.app",
  messagingSenderId: "760069369386",
  appId: "1:760069369386:web:b0808ceaa43d7f074b9d53",
  measurementId: "G-SKSCK0HJKW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- ADMIN UID (SECURITY) ---
const ADMIN_UID = "omM98HhfikPrJxmSRAEouFHSjkB2";

// --- THEME CONFIGURATION ---
const THEMES = [
  // { id: 'love', name: 'Radiance Teal', primary: '#6B9E96', secondary: '#E8A336', icon: '✨' },
  // { id: 'rose', name: 'Royal Rose', primary: '#D63384', secondary: '#FFC107', icon: '💄' },
  // { id: 'ocean', name: 'Ocean Breeze', primary: '#0077B6', secondary: '#90E0EF', icon: '💧' },
  // { id: 'forest', name: 'Forest Vibe', primary: '#2D6A4F', secondary: '#D8F3DC', icon: '🍃' },
  // { id: 'purple', name: 'Purple Haze', primary: '#7209B7', secondary: '#F72585', icon: '🔮' },
  // { id: 'sunset', name: 'Sunset Glow', primary: '#F48C06', secondary: '#FFBA08', icon: '☀️' },
  // { id: 'cherry', name: 'Cherry Blossom', primary: '#FF8FAB', secondary: '#FB6F92', icon: '🌸' },
  // { id: 'coffee', name: 'Coffee Elegance', primary: '#6F4E37', secondary: '#D2B48C', icon: '☕' },
  // { id: 'midnight', name: 'Midnight Gold', primary: '#14213D', secondary: '#FCA311', icon: '⭐' },
  { id: 'default', name: 'Ruby Red', primary: '#E63946', secondary: '#A8DADC', icon: '❤️' },
];

// --- Icons Mapping for Dynamic Services ---
const ICON_MAP = {
  Sparkles: Sparkles,
  Scissors: Scissors,
  Heart: Heart,
  Star: Star,
  Clock: Clock,
  User: User
};

// --- Helper: Convert Image File to Base64 String with Optimization ---
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error("Please select an image file."));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const MAX_DIMENSION = 800;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > MAX_DIMENSION) {
          height *= MAX_DIMENSION / width;
          width = MAX_DIMENSION;
        }
      } else {
        if (height > MAX_DIMENSION) {
          width *= MAX_DIMENSION / height;
          height = MAX_DIMENSION;
        }
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      resolve(dataUrl);
    };
    img.onerror = (error) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image."));
    };
    img.src = objectUrl;
  });
};

// --- Initial Data (Fallback) ---
const INITIAL_PRODUCTS = [];
const INITIAL_SERVICES = [];
const INITIAL_GALLERY = [];
const INITIAL_CATEGORIES = ['Bridal', 'Hair', 'Skin'];

const TEAM_MEMBERS = [
  { name: "Rupa Singh", role: "Hair Specialist", certification: "Advanced Hair Styling Cert.", image: "src/image/profile 1.jpeg" },
  { name: "Anupa Singh", role: "Senior Beautician", certification: "Certified Makeup Artist", image: "src/image/profile 1.jpeg" }
];

// --- Sub-Components ---

// --- NEW: Floating Action Menu (Parent + Children) ---
const FloatingActionMenu = ({ onOpenQuery, isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Configuration for links
  const config = {
    phone: "+916207413198",
    whatsapp: "916207413198",
    location: "https://www.google.com/maps/search/?api=1&query=Radiance+Beauty+Parlour+Near+TV+Tower+Bairiya+Daltonganj+Jharkhand"
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  // Helper for button styles
  const btnBase = "flex items-center group decoration-none";
  const labelBase = `mr-3 px-3 py-1 text-xs font-medium rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-700'}`;
  const iconBase = `w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-colors border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3 pointer-events-none">
      {/* Child Buttons Container */}
      <div className={`transition-all duration-300 ease-in-out flex flex-col items-end space-y-3 ${isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'}`}>

        {/* 1. Ask Queries */}
        <button onClick={() => { onOpenQuery(); setIsOpen(false); }} className={btnBase}>
          <span className={labelBase}>Ask Queries</span>
          <div className={`${iconBase} text-orange-500 hover:bg-orange-50 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <Info size={20} />
          </div>
        </button>

        {/* 2. WhatsApp */}
        <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener noreferrer" className={btnBase}>
          <span className={labelBase}>WhatsApp</span>
          <div className={`${iconBase} text-green-500 hover:bg-green-50 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <MessageCircle size={20} />
          </div>
        </a>

        {/* 3. Location */}
        <a href={config.location} target="_blank" rel="noopener noreferrer" className={btnBase}>
          <span className={labelBase}>Location</span>
          <div className={`${iconBase} text-blue-500 hover:bg-blue-50 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <MapPin size={20} />
          </div>
        </a>

        {/* 4. Call */}
        <a href={`tel:${config.phone}`} className={btnBase}>
          <span className={labelBase}>Call Now</span>
          <div className={`${iconBase} text-red-500 hover:bg-red-50 ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
            <Phone size={20} />
          </div>
        </a>
      </div>

      {/* Parent Toggle Button */}
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 pointer-events-auto ${isOpen ? 'bg-red-500 rotate-45' : 'bg-[var(--theme-primary)] rotate-0'}`}
        style={{ boxShadow: `0 4px 14px 0 var(--theme-primary)` }}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

// --- NEW: Query Modal for Floating Button ---
const QueryModal = ({ isOpen, onClose, formData, setFormData, onSubmit, isDarkMode }) => {
  if (!isOpen) return null;

  const inputClass = `w-full p-3 rounded-lg border outline-none focus:ring-2 focus:ring-[var(--theme-primary)] transition-all ${isDarkMode ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-gray-50 border-gray-200"}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="bg-[var(--theme-primary)] p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Info size={20} /> Ask a Query
          </h3>
          <button onClick={onClose} className="hover:rotate-90 transition-transform">
            <X size={20} />
          </button>
        </div>

        <form className="p-6 space-y-4" onSubmit={(e) => { onSubmit(e); onClose(); }}>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Your Name</label>
            <input required type="text" placeholder="sakshi" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Phone Number</label>
            <input required type="tel" placeholder="1234567890" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 opacity-80">Question / Message</label>
            <textarea required rows="4" placeholder="How can I help you?" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className={inputClass}></textarea>
          </div>

          <Button className="w-full">Send Message</Button>
          <p className="text-xs text-center opacity-60">We will reply via WhatsApp shortly.</p>
        </form>
      </div>
    </div>
  );
};

// --- NEW: Stripe Banner Component ---
const StripeBanner = ({ text }) => {
  if (!text) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] py-3 overflow-hidden shadow-lg my-8 relative z-20 border-y border-[#DAA520]">
      <div className="flex overflow-hidden w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="flex items-center">
              <span className="mx-8 font-bold uppercase tracking-widest text-white drop-shadow-md flex items-center gap-3 text-sm md:text-base">
                <Sparkles size={16} className="text-white fill-white" /> {text}
              </span>
              <span className="mx-8 font-bold uppercase tracking-widest text-white drop-shadow-md flex items-center gap-3 text-sm md:text-base">
                <Megaphone size={16} className="text-white fill-white" /> {text}
              </span>
            </div>
          ))}
        </div>
      </div>
      <style>{`
         .animate-marquee {
           animation: marquee 60s linear infinite; 
         }
         @keyframes marquee {
           0% { transform: translateX(0); }
           100% { transform: translateX(-50%); }
         }
       `}</style>
    </div>
  );
};

// --- NEW: Falling Effects Component (Restored & Mobile Friendly) ---
const FallingOverlay = ({ icon }) => {
  // Fewer items for mobile friendliness
  const count = 12;
  const items = useRef(Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: Math.random() * 100, // Random horizontal position 0-100%
    delay: Math.random() * 5,  // Random delay 0-5s
    duration: 10 + Math.random() * 15, // Slower duration (10-25s) for relaxing feel
    size: 14 + Math.random() * 16 // Smaller size (14-30px) to not block text
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.current.map((item) => (
        <div
          key={item.id}
          className="absolute top-[-50px] animate-fall opacity-30 select-none" // Low opacity
          style={{
            left: `${item.left}%`,
            animation: `fall ${item.duration}s linear infinite`,
            animationDelay: `${item.delay}s`,
            fontSize: `${item.size}px`
          }}
        >
          {icon}
        </div>
      ))}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const Button = ({ children, className, variant = 'primary', ...props }) => {
  const baseStyle = "px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:-translate-y-1 shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";
  // Updated variants to use CSS variables
  const variants = {
    primary: "bg-[var(--theme-primary)] text-white hover:brightness-110 shadow-[var(--theme-primary)]/30",
    secondary: "bg-[#3D3D3D] text-white hover:bg-black shadow-gray-500/30",
    outline: "border-2 border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary)] hover:text-white",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-red-500/30",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 shadow-none",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#128C7E] shadow-green-500/30"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const InstallBanner = ({ onInstall, onClose, isVisible }) => {
  if (!isVisible) return null;
  return (
    <div className={`hidden md:flex fixed bottom-6 right-6 z-[60] animate-fade-in-up`}>
      <button
        onClick={onInstall}
        className="bg-[#B3121A] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 hover:bg-[#d48e24] transition-colors border-2 border-white/20"
      >
        <div className="bg-white/20 p-1.5 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        />
      </button>
    </div>
  );
};

const SkeletonCard = ({ isDarkMode }) => (
  <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'} p-6 rounded-2xl shadow-sm border h-full flex flex-col animate-pulse`}>
    <div className={`w-14 h-14 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-full mb-4`}></div>
    <div className={`h-6 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-3/4 mb-2`}></div>
    <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-full mb-2`}></div>
    <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-5/6 mb-3`}></div>
    <div className="mt-auto pt-2 flex justify-between items-center">
      <div className={`h-5 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-16`}></div>
      <div className={`h-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded w-12`}></div>
    </div>
  </div>
);

const SkeletonImage = ({ isDarkMode }) => (
  <div className={`aspect-square ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-2xl animate-pulse w-full h-full relative overflow-hidden`}>
    <div className={`absolute inset-0 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 via-gray-700 to-gray-800' : 'from-gray-200 via-gray-100 to-gray-200'} animate-[shimmer_1.5s_infinite]`}></div>
  </div>
);

const NotificationToast = ({ message, type, onClose }) => {
  if (!message) return null;
  // Use theme primary for success
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-[var(--theme-primary)]';
  const Icon = type === 'error' ? AlertCircle : CheckCircle;

  return (
    <div className={`fixed top-24 right-4 z-[60] ${bgColor} text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in-down`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-4 opacity-80 hover:opacity-100"><X size={16} /></button>
    </div>
  );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm w-full animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-[#3D3D3D] mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-6">{message || "This action cannot be undone."}</p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="danger" className="flex-1" onClick={() => { onConfirm(); onClose(); }}>Delete</Button>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose, services, isDarkMode }) => {
  if (!isOpen) return null;
  const [formData, setFormData] = useState({ name: '', service: '', date: '', time: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.service || !formData.date || !formData.time) {
      alert("Please fill all fields");
      return;
    }
    const text = `*New Booking Request* 📅\n\n*Name:* ${formData.name}\n*Service:* ${formData.service}\n*Date:* ${formData.date}\n*Preferred Time:* ${formData.time}\n\nPlease confirm my appointment.`;
    window.open(`https://wa.me/916207413198?text=${encodeURIComponent(text)}`, '_blank');
    onClose();
  };

  const today = new Date().toISOString().split('T')[0];
  const inputClass = `w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-[var(--theme-primary)] outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-200'}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className={`rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
        <div className="bg-[var(--theme-primary)] p-4 text-white flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2"><Calendar size={20} /> Book Appointment</h3>
          <button onClick={onClose}><X size={20} className="hover:rotate-90 transition-transform" /></button>
        </div>
        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Your Name</label>
            <input required type="text" className={inputClass} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Enter your name" />
          </div>
          <div>
            <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Select Service</label>
            <select required className={inputClass} value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
              <option value="">-- Choose a Service --</option>
              {services.map(s => <option key={s.id} value={s.title}>{s.title}</option>)}
              <option value="General Inquiry">Other / General Inquiry</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Date</label>
              <input required type="date" min={today} className={inputClass} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div>
              <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time</label>
              <input required type="time" className={inputClass} value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
            </div>
          </div>
          <div className="pt-2">
            <Button variant="whatsapp" className="w-full justify-center">
              <MessageCircle size={18} /> Book via WhatsApp
            </Button>
            <p className="text-xs text-center text-gray-400 mt-2">This will open WhatsApp to send your details.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const ServiceCard = ({ iconName, title, price, description, onClick, isDarkMode }) => {
  const Icon = ICON_MAP[iconName] || Sparkles;
  return (
    <div
      onClick={onClick}
      // Replaced hover color with variable
      className={`p-6 rounded-2xl shadow-lg transition-all duration-300 border group h-full flex flex-col cursor-pointer transform hover:-translate-y-2 hover:bg-[var(--theme-primary)] ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-[#B8BC86] border-[#f0ebe0]'}`}
    >
      {/* Replaced icon color with variable */}
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors duration-300 shrink-0 ${isDarkMode ? 'bg-gray-700' : 'bg-[#F2F7F6]'}`}>
        <Icon className="text-[var(--theme-primary)] group-hover:text-[var(--theme-primary)] transition-colors duration-300" size={24} />
      </div>
      <h3 className={`text-xl font-serif font-bold mb-2 group-hover:text-white transition-colors ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>{title}</h3>
      <p className={`text-sm mb-3 flex-grow group-hover:text-white/90 transition-colors line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{description}</p>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-transparent group-hover:border-white/20">
        <div className="text-[#B83C08] font-bold group-hover:text-yellow-300 transition-colors">{price}</div>
        <div className="text-xs text-[#B83C08] font-bold group-hover:translate-x-1 transition-transform group-hover:text-white flex items-center">View <ArrowLeft className="rotate-180 ml-1 w-3 h-3" /></div>
      </div>
    </div>
  );
};

const AnnouncementPopup = ({ config, isVisible, onClose }) => {
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
      {/* Replaced border and text color with secondary variable */}
      <div className="bg-[#3D3D3D] text-white p-4 rounded-xl shadow-2xl border-l-4 border-[var(--theme-secondary)] flex items-start gap-3 relative">
        <div className="bg-white/10 p-2 rounded-full shrink-0">
          <Megaphone size={20} className="text-[var(--theme-secondary)]" />
        </div>
        <div className="flex-1 pr-4">
          <h4 className="font-bold text-[var(--theme-secondary)] text-xs uppercase tracking-wider mb-1">Latest Update</h4>
          <p className="text-sm leading-snug font-medium opacity-95">{config.announcementText || "Welcome to Radiance Beauty Parlour!"}</p>
        </div>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors p-1"><X size={14} /></button>
      </div>
    </div>
  );
};

const HomeView = ({ handleNav, queryForm, setQueryForm, handleQuerySubmit, services, siteConfig, openBooking, galleryCategories, isLoading, isDarkMode }) => {
  const [serviceCategory, setServiceCategory] = useState('all');
  const [showAllServices, setShowAllServices] = useState(false);

  const activeServices = services.filter(s =>
    !s.isHidden && (serviceCategory === 'all' || s.category === serviceCategory)
  );

  const displayedServices = showAllServices ? activeServices : activeServices.slice(0, 6);

  const dynamicTeam = TEAM_MEMBERS.map(member => {
    if (member.name.includes("Rupa") && siteConfig?.expertRupa) return { ...member, image: siteConfig.expertRupa };
    if (member.name.includes("Anupa") && siteConfig?.expertAnupa) return { ...member, image: siteConfig.expertAnupa };
    return member;
  });

  return (
    <>
      <section className="relative pt-24 pb-16 md:pt-40 md:pb-32 px-6 overflow-hidden">
        {/* Replaced background color variable */}
        <div className="absolute top-0 right-0 w-2/3 md:w-1/3 h-full bg-[var(--theme-primary)]/10 -z-10 rounded-l-[100px]"></div>
        <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6 animate-fade-in-up order-2 md:order-1 text-center md:text-left">
            {/* UPDATED: Welcome Badge to Golden */}
            <div className="inline-block px-4 py-1 bg-[#FFD700]/10 text-[#B8860B] border border-[#FFD700]/50 rounded-full text-xs md:text-sm font-bold tracking-wider mb-2">
              WELCOME TO RADIANCE
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>
              Reveal Your Inner <span className="text-[var(--theme-primary)]">Glow</span> & Beauty
            </h1>
            <p className={`text-sm leading-relaxed md:text-lg md:leading-normal max-w-[90%] md:max-w-lg mx-auto md:mx-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Experience the art of beauty with our premium makeup, hair styling, and spa services designed to make you shine on your special days.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button variant="primary" onClick={openBooking} className="w-full sm:w-auto">Book Now</Button>
              <Button variant="outline" onClick={() => handleNav('store')} className="w-full sm:w-auto">Visit Product Store</Button>
            </div>
          </div>

          <div className="relative flex justify-center order-1 md:order-2">
            <div className="relative">
              {/* --- NEW: Rotating Logo Rings --- */}
              <div className="absolute -inset-4 rounded-full border-2 border-dashed border-[var(--theme-secondary)] animate-spin-slow opacity-60"></div>
              <div className="absolute -inset-2 rounded-full border border-dashed border-[var(--theme-primary)] animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }}></div>

              <div className={`w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border-[8px] md:border-[12px] shadow-2xl overflow-hidden relative flex items-center justify-center z-10 ${isDarkMode ? "border-gray-800 bg-gray-800" : "border-white bg-[#F9F7F2]"}`}>
                <img src={mainLogo} alt="Radiance Logo" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className={`absolute -bottom-4 right-10 md:right-auto md:-left-4  p-1.5 md:p-3 scale-85 md:scale-100 rounded-xl shadow-lg flex items-center gap-3 animate-bounce-slow max-w-[150px] z-20 ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
              <div className="bg-[#5CFF5C] p-2 rounded-full text-white"><Star size={16} fill="currentColor" /></div>
              <div className="text-left scale-90 md:scale-100"><p className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>4.9 Rating</p><p className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">From Happy Clients</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ADDED: Stripe Banner Before Services --- */}
      {siteConfig?.showAnnouncement && <StripeBanner text={siteConfig.announcementText} />}

      <section id="services" className={`py-16 md:py-20 ${isDarkMode ? 'bg-[#1A1A1A]' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className={`text-3xl md:text-4xl font-serif font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Our Services</h2>
            {/* Replaced separator color */}
            <div className="w-24 h-1 bg-[var(--theme-secondary)] mx-auto rounded-full mb-6"></div>
            <p className="text-gray-400 text-sm md:text-gray-600 md:text-base mt-2 md:mt-3 text-center">
              Click on any service to see our work gallery.
            </p>
          </div>

          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 md:gap-4 mb-10 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {['all', ...galleryCategories].map(filter => (
              <button
                key={filter}
                onClick={() => { setServiceCategory(filter); setShowAllServices(false); }}
                // Replaced active bg color
                className={`whitespace-nowrap px-5 py-2 rounded-full capitalize font-medium transition-all text-sm md:text-base 
                  ${serviceCategory === filter
                    ? 'bg-[var(--theme-primary)] text-white shadow-lg transform scale-105'
                    : isDarkMode ? 'bg-[#2A2A2A] text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
              >
                {filter === 'all' ? 'All Services' : filter}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {isLoading ? (
              Array(6).fill(0).map((_, i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
            ) : displayedServices.length > 0 ? (
              displayedServices.map((s) => (
                <ServiceCard key={s.id} {...s} onClick={() => handleNav('gallery', null, s.id)} isDarkMode={isDarkMode} />
              ))
            ) : (
              <p className="text-center col-span-full text-gray-400 py-10">No services available in this category.</p>
            )}
          </div>

          {activeServices.length > 6 && !isLoading && (
            <div className="mt-12 text-center">
              <Button variant="outline" onClick={() => setShowAllServices(!showAllServices)} className="min-w-[200px]">
                {showAllServices ? <>Show Less <ChevronUp size={16} /></> : <>View All Services ({activeServices.length}) <ChevronDown size={16} /></>}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Replaced About Section BG color */}
      <section id="about" className="py-16 md:py-20 bg-[var(--theme-primary)] text-white">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Why Choose Radiance?</h2>
            <p className="mb-6 opacity-90 text-sm leading-relaxed md:text-lg md:leading-normal max-w-[90%] md:max-w-xl mx-auto md:mx-0">At Radiance Beauty Parlour, beauty is more than just skin deep. We combine traditional techniques with modern style to give you the perfect look.</p>
            <ul className="space-y-4">
              {["Certified Experts", "Premium Products", "Hygienic Environment", "Customized Care"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                  {/* Replaced Icon text color */}
                  <div className="bg-white text-[var(--theme-primary)] p-1 rounded-full"><CheckCircle size={16} /></div><span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4 order-1 md:order-2">
            <img src={img2} className="rounded-2xl transform translate-y-8 shadow-xl w-full h-auto border-2 border-[#E8A336]" />
            <img src={img1} className="rounded-2xl transform translate-y-8 shadow-xl w-full h-auto border-2 border-[#E8A336]" />
          </div>
        </div>
      </section>

      <section className={`py-16 md:py-20 ${isDarkMode ? 'bg-[#121212]' : 'bg-[#FDFBF7]'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <h2 className={`text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Meet Our Experts</h2>
            <p className="text-gray-500 text-sm md:text-gray-600 md:text-base mt-1 md:mt-2 text-center">The magic hands behind your glow</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {dynamicTeam.map((member, i) => (
              <div key={i} className={`p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6 border hover:shadow-xl transition-shadow text-center sm:text-left ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-gray-100'}`}>
                {/* --- NEW: Rotating Expert Rings --- */}
                <div className="relative shrink-0">
                  <div className="absolute -inset-2 rounded-full border border-dashed border-[var(--theme-primary)] animate-spin-slow"></div>
                  <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-[#F2F7F6] relative z-10" />
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>{member.name}</h3>
                  {/* Replaced role text color */}
                  <p className="text-[var(--theme-primary)] font-medium">{member.role}</p>
                  <p className={`text-sm mt-2 flex items-center justify-center sm:justify-start gap-1 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-500'}`}><Star size={14} className="text-[var(--theme-secondary)] fill-current" /> {member.certification}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className={`py-12 md:py-20 ${isDarkMode ? "bg-[#1A1A1A]" : "bg-white"}`}
      >
        <div className="container mx-auto px-6">
          <div
            className={`grid md:grid-cols-2 gap-8 md:gap-12 shadow-2xl rounded-3xl overflow-hidden border ${isDarkMode ? "border-gray-700" : "border-gray-100"
              }`}
          >
            {/* LEFT: Contact Info */}
            <div className="p-8 md:p-14 bg-[#3D3D3D] text-white">
              <h2 className="text-2xl md:text-3xl font-serif font-bold mb-8">
                Get in Touch
              </h2>

              <div className="space-y-8">
                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-full">
                    {/* Replaced Icon color */}
                    <Clock className="text-[var(--theme-secondary)]" />
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">Operating Hours</h3>
                    <p className="opacity-80 font-mono text-sm">Monday - Sunday</p>
                    <p className="text-[var(--theme-secondary)] font-bold text-sm md:text-base leading-relaxed">
                      9:30 AM - 08:00 PM
                    </p>

                    <p className="text-xs text-gray-400 mt-1">Open 7 Days a Week</p>
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
                      href="tel:+916207413198"
                      className="opacity-80 font-mono text-sm hover:text-[var(--theme-secondary)] block"
                    >
                      +91 62074 13198
                    </a>
                    <a
                      href="tel:+918340677007"
                      className="opacity-80 font-mono text-sm hover:text-[var(--theme-secondary)] block"
                    >
                      +91 83406 77007
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
                      href="https://www.google.com/maps/search/?api=1&query=Radiance+Beauty+Parlour+Near+TV+Tower+Bairiya+Daltonganj+Jharkhand"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:text-[var(--theme-secondary)] block text-sm"
                    >
                      Radiance Beauty Parlour <br />
                      Near TV Tower Bairiya, Daltonganj
                      <br />
                      Jharkhand, India - 822101
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
                      href="https://www.instagram.com/radiance_parlour_dto/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-80 hover:text-[var(--theme-secondary)] block text-sm"
                    >
                      @radiance_parlour_dto
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Query Form */}
            <div
              className={`p-8 md:p-14 ${isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
                }`}
            >
              <h2
                className={`text-2xl md:text-3xl font-serif font-bold mb-6 ${isDarkMode ? "text-white" : "text-[#3D3D3D]"
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
                  // Replaced focus ring
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)] ${isDarkMode
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
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)] ${isDarkMode
                    ? "bg-gray-700 text-white placeholder-gray-400"
                    : "bg-[#F9F7F2]"
                    }`}
                />

                <textarea
                  required
                  rows="4"
                  placeholder={`Your Message...
We will reply via Whatsapp.`}
                  value={queryForm.message}
                  onChange={(e) =>
                    setQueryForm({ ...queryForm, message: e.target.value })
                  }
                  className={`w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-[var(--theme-primary)]  placeholder:text-[12px] md:placeholder:text-sm   ${isDarkMode
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

const GalleryView = ({ handleNav, gallery, galleryFilter, setGalleryFilter, galleryCategories, services, isLoading, isDarkMode }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  // Check if current filter is a Service ID
  const activeService = services.find(s => s.id === galleryFilter);

  const displayedImages = gallery.filter(img => {
    if (img.isHidden) return false;

    // If filter is a service ID, show images for that specific service
    if (activeService) {
      return img.serviceId === activeService.id;
    }

    // Otherwise show by category
    return (galleryFilter === 'all' || img.category === galleryFilter);
  });

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="container mx-auto relative">
        {/* Back to Home Button */}
        <button
          onClick={() => handleNav('home')}
          className={`absolute top-0 left-0 flex items-center gap-2 text-sm font-medium hover:underline z-10 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="text-center mb-8 pt-8 md:pt-0">
          <h2 className={`text-4xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Our Gallery</h2>
          {activeService ? (
            <div className="mt-2 flex flex-col items-center animate-fade-in">
              <span className="bg-[var(--theme-primary)] text-white px-3 py-1 rounded-full text-sm font-medium mb-2">Service: {activeService.title}</span>
              <button onClick={() => setGalleryFilter('all')} className="text-sm underline hover:text-[var(--theme-primary)] flex items-center gap-1">
                <ArrowLeft size={14} /> Back to All Photos
              </button>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">A glimpse of our finest work</p>
          )}
        </div>

        {/* UPDATED: GALLERY TABS - Hide if viewing specific service */}
        {!activeService && (
          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 md:gap-4 mb-12 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {['all', ...galleryCategories].map(filter => (
              <button
                key={filter}
                onClick={() => setGalleryFilter(filter)}
                // Replaced active bg color
                className={`whitespace-nowrap flex-shrink-0 px-6 py-2 rounded-full capitalize font-medium transition-all text-sm md:text-base 
                    ${galleryFilter === filter
                    ? 'bg-[var(--theme-primary)] text-white shadow-lg transform scale-105'
                    : isDarkMode ? 'bg-[#2A2A2A] text-gray-300 hover:bg-gray-700 border-gray-700' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
              >
                {filter === 'all' ? 'All Photos' : `${filter} Services`}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => <SkeletonImage key={i} isDarkMode={isDarkMode} />)
          ) : displayedImages.length > 0 ? (
            displayedImages.map((img) => (
              <div
                key={img.id}
                onClick={() => setSelectedImage(img)}
                className={`group relative aspect-square overflow-hidden rounded-2xl shadow-md cursor-zoom-in ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
              >
                <img src={img.url} alt={img.category} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <Camera size={48} className="mx-auto mb-4 opacity-50" />
              <p>No images found {activeService ? `for ${activeService.title}` : 'yet'}.</p>
              {activeService && <button onClick={() => setGalleryFilter('all')} className="mt-4 text-[var(--theme-primary)] underline">View All Gallery</button>}
            </div>
          )}
        </div>

        {/* GALLERY LIGHTBOX (FULL SCREEN) */}
        {selectedImage && (
          <div className="fixed inset-0 z-[80] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-white/10 p-2 rounded-full hover:bg-white/20">
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

const StoreView = ({ handleNav, products, searchTerm, setSearchTerm, selectedProduct, setSelectedProduct, cart, setCart, notify, isLoading, isDarkMode }) => {
  const [storeCategory, setStoreCategory] = useState('all');
  const [isBagOpen, setIsBagOpen] = useState(false);

  const filteredProducts = products.filter(p =>
    !p.isHidden &&
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (storeCategory === 'all' || p.category === storeCategory)
  );

  const addToCart = (product) => {
    setCart([...cart, product]);
    notify(`${product.name} added to inquiry bag!`, 'success');
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const sendInquiry = () => {
    if (cart.length === 0) return;
    let message = "Hello Radiance Team! 👋\nI am interested in knowing the availability/details of these products:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.price})\n`;
    });
    message += "\nPlease let me know if they are available.";
    window.open(`https://wa.me/916207413198?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="container mx-auto relative">
        {/* Back to Home Button */}
        <button
          onClick={() => handleNav('home')}
          className={`absolute top-0 left-0 flex items-center gap-2 text-sm font-medium hover:underline z-10 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="text-center mb-10 pt-8 md:pt-0">
          <h2
            className={`text-3xl md:text-4xl font-serif font-bold ${isDarkMode ? "text-white" : "text-[#3D3D3D]"
              }`}
          >
            Radiance Store
          </h2>

          <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2">
            Browse our exclusive collection
          </p>
        </div>


        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              // Replaced focus ring
              className={`w-full pl-12 pr-4 py-3 rounded-full border shadow-sm focus:ring-2 focus:ring-[var(--theme-primary)] outline-none ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-gray-200 text-gray-800'}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          </div>

          {/* UPDATED: STORE TABS */}
          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 gap-y-3 mb-8 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {['all', 'Skincare', 'Haircare', 'Makeup', 'Accessories', 'Rental Items', 'Others'].map(cat => (
              <button
                key={cat}
                onClick={() => setStoreCategory(cat)}
                // Replaced hover border color
                className={`whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all 
                  ${storeCategory === cat
                    ? 'bg-[#3D3D3D] text-white shadow-md'
                    : isDarkMode ? 'bg-[#2A2A2A] text-gray-300 border-gray-700 border hover:border-[var(--theme-primary)]' : 'bg-white border border-gray-200 text-gray-600 hover:border-[var(--theme-primary)]'}`}
              >
                {cat === 'all' ? 'All Products' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            Array(8).fill(0).map((_, i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
          ) : filteredProducts.map((product) => {
            const isOutOfStock = product.status !== 'In Stock';
            return (
              <div key={product.id} className={`rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`}>
                <div className={`h-48 overflow-hidden relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <img src={product.image} alt={product.name} className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isOutOfStock ? 'grayscale opacity-70' : ''}`} />
                  {isOutOfStock ? (
                    <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{product.status}</span>
                  ) : (
                    product.status !== 'In Stock' && <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">{product.status}</span>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  {/* Replaced category color */}
                  <span className="text-xs font-bold text-[var(--theme-primary)] uppercase tracking-wide">{product.category}</span>
                  <h3 className={`font-bold text-lg mt-1 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>{product.name}</h3>
                  <div className="flex flex-col gap-2 mt-auto pt-4">
                    <div className="flex justify-between items-center">
                      {/* Replaced price color */}
                      <span className={`text-lg font-bold ${isOutOfStock ? 'text-gray-500' : 'text-[var(--theme-secondary)]'}`}>{product.price}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="flex-1 py-1.5 text-xs px-2" onClick={() => setSelectedProduct(product)}>Details</Button>
                      <button onClick={() => addToCart(product)} disabled={isOutOfStock} className={`text-white p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center flex-1 ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--theme-primary)] hover:brightness-110'}`}>
                        {isOutOfStock ? <Ban size={18} /> : <Plus size={18} />}
                        {isOutOfStock && <span className="ml-2 text-xs">Out</span>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Cart Button (Moved up slightly to avoid FAB overlap) */}
        {cart.length > 0 && (
          <div className="fixed bottom-24 right-6 z-40">
            {/* Replaced floating button color */}
            <button onClick={() => setIsBagOpen(true)} className="bg-[var(--theme-secondary)] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform relative flex items-center justify-center animate-bounce-slow">
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">{cart.length}</span>
            </button>
          </div>
        )}

        {/* Cart Modal */}
        {isBagOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsBagOpen(false)}>
            <div className={`rounded-t-2xl sm:rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className="bg-[#3D3D3D] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2"><ShoppingBag size={20} /> Your Inquiry Bag ({cart.length})</h3>
                <button onClick={() => setIsBagOpen(false)}><X size={20} /></button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? <p className="text-center text-gray-500 py-4">Your bag is empty.</p> : (
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <img src={item.image} className="w-10 h-10 rounded object-cover" alt="" />
                          <div>
                            <p className={`font-bold text-sm line-clamp-1 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.name}</p>
                            {/* Replaced price color */}
                            <p className="text-xs text-[var(--theme-secondary)] font-bold">{item.price}</p>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                <Button className="w-full bg-[#25D366] hover:bg-[#128C7E]" onClick={sendInquiry}>
                  <MessageCircle size={10} /> Send Inquiry via WhatsApp
                </Button>
                <p className="text-[10px] text-center text-gray-400 mt-2">We will confirm availability & total price.</p>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
            <div className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in-up ${isDarkMode ? 'bg-[#2A2A2A]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <div className={`relative h-64 md:h-72 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm"><X size={20} /></button>
              </div>
              <div className="p-6 md:p-8">
                <h3 className={`text-2xl font-serif font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>{selectedProduct.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  {/* Replaced category color */}
                  <span className="text-[var(--theme-primary)] font-medium bg-[#F2F7F6] px-3 py-1 rounded-full text-sm">{selectedProduct.category}</span>
                  {/* Replaced price color */}
                  <span className="text-xl font-bold text-[var(--theme-secondary)]">{selectedProduct.price}</span>
                </div>
                <p className={`mb-6 text-sm md:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{selectedProduct.description}</p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="secondary"
                    className="flex-1 py-3 text-sm md:text-base"
                    onClick={() => addToCart(selectedProduct)}
                  >
                    Add to Bag
                  </Button>

                  <Button
                    variant="primary"
                    className="flex-1 py-3 text-sm md:text-base"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Close
                  </Button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminView = ({ isAdmin, user, adminEmail, setAdminEmail, adminPass, setAdminPass, messages, setMessages, products, setProducts, gallery, setGallery, services, setServices, galleryCategories, setGalleryCategories, categoriesDocs, siteConfig, notify, isDarkMode }) => {
  const [loginError, setLoginError] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [editingService, setEditingService] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, action: null, message: '' });
  const [selectedSiteImages, setSelectedSiteImages] = useState({});
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);

  // Drag and Drop Refs
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // --- NEW: Robust Date Formatter Helper ---
  const getFormattedDate = (timestamp, dateStr) => {
    if (timestamp && typeof timestamp.seconds === 'number') {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return dateStr || "Just now";
  };

  const confirmAction = (action, message) => { setConfirmModal({ isOpen: true, action, message }); };
  const handleLogin = async () => { /* ... (Same Login Logic) ... */ try { await signInWithEmailAndPassword(auth, adminEmail, adminPass); setLoginError(''); } catch (error) { setLoginError('Login failed.'); } };
  const handleLogout = async () => { try { await signOut(auth); } catch (error) { console.error(error); } };

  // Database actions remain same
  const handleToggleRead = async (id, currentStatus) => { await updateDoc(doc(db, "messages", id), { isRead: !currentStatus }); };
  const handleDeleteMessage = (id) => { confirmAction(async () => { await deleteDoc(doc(db, "messages", id)); notify("Message deleted", "success"); }, "Delete this query?"); };

  // --- UPDATED: Handle Reply with Pre-filled Message ---
  const handleReply = async (id, phone, name, userMessage) => {
    await updateDoc(doc(db, "messages", id), { isReplied: true, isRead: true });
    const replyText = `Hello ${name}, thank you for contacting Radiance Beauty Parlour! ✨\n\nRegarding your query: "${userMessage}"\n\nWe are here to help!\n\n .....\n\nBest regards,\nRadiance Team 🫰`;
    const cleanPhone = phone.replace(/\D/g, '').replace(/^0+/, "");
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${finalPhone}?text=${encodeURIComponent(replyText)}`, '_blank');
  };

  const handleSaveService = async (e) => { e.preventDefault(); /* ... same logic ... */ const form = e.target; const data = { title: form.sTitle.value, price: form.sPrice.value, description: form.sDesc.value, iconName: form.sIcon.value, category: form.sCategory.value || 'all' }; try { if (editingService) { await updateDoc(doc(db, "services", editingService.id), data); notify("Updated!", 'success'); setEditingService(null); } else { await addDoc(collection(db, "services"), { ...data, isHidden: false, createdAt: serverTimestamp() }); notify("Added!", 'success'); } form.reset(); } catch (e) { notify("Error", 'error'); } };
  const handleDeleteService = (id) => { confirmAction(async () => { await deleteDoc(doc(db, "services", id)); notify("Deleted", "success"); }, "Delete?"); };
  const handleToggleService = async (id, val) => { await updateDoc(doc(db, "services", id), { isHidden: !val }); };
  const handleAddCategory = async (e) => { e.preventDefault(); if (newCategory.trim() && !galleryCategories.includes(newCategory.toLowerCase())) { await addDoc(collection(db, "categories"), { name: newCategory.toLowerCase() }); setNewCategory(''); notify("Added!", 'success'); } };

  const handleDeleteCategory = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "categories", id));
      notify("Category Deleted", "success");
    }, "Delete this category? This might affect existing services/images.");
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault(); const form = e.target; const file = form.pImage.files[0];
    if (file) {
      try {
        let img = await convertToBase64(file);
        const data = { name: form.pName.value, price: form.pPrice.value, category: form.pCat.value, image: img, description: form.pDesc.value, status: form.pStatus.value };
        if (editingProduct) {
          await updateDoc(doc(db, "products", editingProduct.id), data); notify("Updated", 'success'); setEditingProduct(null);
        } else {
          await addDoc(collection(db, "products"), { ...data, isHidden: false, createdAt: serverTimestamp() }); notify("Added", 'success');
        }
        form.reset();
      } catch (e) { notify("Error saving product: " + e.message, 'error'); }
    } else {
      if (editingProduct) {
        const data = { name: form.pName.value, price: form.pPrice.value, category: form.pCat.value, description: form.pDesc.value, status: form.pStatus.value };
        try {
          await updateDoc(doc(db, "products", editingProduct.id), data); notify("Updated", 'success'); setEditingProduct(null); form.reset();
        } catch (e) { notify("Error updating product", 'error'); }
      } else {
        notify("Please select an image for new products", 'error');
      }
    }
  };

  const handleDeleteProduct = (id) => { confirmAction(async () => { await deleteDoc(doc(db, "products", id)); notify("Deleted", "success"); }, "Delete?"); };
  const handleToggleProduct = async (id, val) => { await updateDoc(doc(db, "products", id), { isHidden: !val }); };

  // --- REFACTORED: Handle Save Gallery (Add & Edit) ---
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.querySelector('input[type="file"]').files[0];
    const category = form.gCat.value;
    const serviceId = form.gService.value;

    let docData = {
      category: category,
    };

    // Handle Service Linking Logic
    if (serviceId) {
      const selectedService = services.find(s => s.id === serviceId);
      if (selectedService) {
        docData.serviceId = serviceId;
        docData.serviceName = selectedService.title;
      } else {
        docData.serviceId = null;
        docData.serviceName = null;
      }
    } else {
      docData.serviceId = null;
      docData.serviceName = null;
    }

    try {
      if (editingGalleryItem) {
        // UPDATE Existing Image
        if (file) {
          const img = await convertToBase64(file);
          docData.url = img;
        }
        await updateDoc(doc(db, "gallery", editingGalleryItem.id), docData);
        notify("Image Updated!", 'success');
        setEditingGalleryItem(null); // Exit edit mode
      } else {
        // ADD New Image
        if (!file) return notify("Please select an image", "error");

        const img = await convertToBase64(file);
        docData.url = img;
        docData.isHidden = false;
        docData.createdAt = serverTimestamp();

        const newOrder = gallery.length > 0 ? Math.max(...gallery.map(g => g.order || 0)) + 1 : 0;
        docData.order = newOrder;

        await addDoc(collection(db, "gallery"), docData);
        notify("Image Added!", 'success');
      }
      form.reset();
    } catch (error) {
      console.error("Gallery Save Error:", error);
      notify("Error saving image: " + error.message, 'error');
    }
  };

  const handleDeleteGallery = (id) => { confirmAction(async () => { await deleteDoc(doc(db, "gallery", id)); notify("Deleted", "success"); }, "Delete?"); };
  const handleToggleGallery = async (id, val) => { await updateDoc(doc(db, "gallery", id), { isHidden: !val }); };

  const handleSiteImageSelect = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSiteImages(prev => ({ ...prev, [field]: file }));
    }
  };

  const handleSiteImageUpload = async (field) => {
    const file = selectedSiteImages[field];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      await setDoc(doc(db, "site_settings", "config"), { [field]: base64 }, { merge: true });
      notify("Image uploaded successfully!", 'success');
      setSelectedSiteImages(prev => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    } catch (e) {
      notify("Error uploading image: " + e.message, 'error');
    }
  };

  const handleUpdateAnnouncement = async (e) => { e.preventDefault(); const text = e.target.annText.value; const show = e.target.annShow.checked; await setDoc(doc(db, "site_settings", "config"), { announcementText: text, showAnnouncement: show }, { merge: true }); notify("Updated!", 'success'); };

  // --- NEW: Theme Selection Handler ---
  const handleUpdateTheme = async (themeId) => {
    await setDoc(doc(db, "site_settings", "config"), { themeId: themeId }, { merge: true });
    notify("Theme Updated!", 'success');
  };

  const handleSort = () => {
    let _galleryItems = [...gallery];
    const draggedItemContent = _galleryItems.splice(dragItem.current, 1)[0];
    _galleryItems.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setGallery(_galleryItems);
    saveGalleryOrder(_galleryItems);
  };

  const saveGalleryOrder = async (items) => {
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const docRef = doc(db, "gallery", item.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
      notify("Gallery order updated!", "success");
    } catch (error) {
      console.error("Error updating order:", error);
      notify("Failed to save order.", "error");
    }
  };

  // UPDATED: Increased padding for better mobile touch area, improved responsiveness
  const cardClass = `p-4 md:p-6 rounded-2xl shadow-md lg:col-span-2 border-l-4 border-[var(--theme-primary)] ${isDarkMode ? 'bg-[#2A2A2A] text-white' : 'bg-white'}`;
  const inputClass = `w-full p-2.5 rounded border text-sm outline-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200 text-gray-800'}`;

  if (!user) return (
    <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
      <div className={`p-8 rounded-2xl shadow-xl w-full max-w-md border ${isDarkMode ? 'bg-[#2A2A2A] border-gray-700' : 'bg-white border-gray-100'}`}>
        <h2 className={`text-2xl font-serif font-bold mb-6 text-center ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Admin Login</h2>
        <div className="space-y-4">
          <input type="email" placeholder="Admin Email" className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} value={adminEmail} onChange={e => { setAdminEmail(e.target.value); setLoginError(''); }} />
          <input type="password" placeholder="Password" className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)] ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} value={adminPass} onChange={e => { setAdminPass(e.target.value); setLoginError(''); }} />
          {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}
          <Button className="w-full" onClick={handleLogin}>Login</Button>
        </div>
      </div>
    </div>
  );

  if (user.uid !== ADMIN_UID) return <div className="pt-32 text-center">Access Denied</div>;

  return (
    <div className={`pt-24 pb-20 px-4 md:px-6 min-h-screen ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
      <ConfirmationModal isOpen={confirmModal.isOpen} onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })} onConfirm={confirmModal.action} message={confirmModal.message} />
      <div className="container mx-auto">
        {/* UPDATED: Flex-col on mobile for title/logout button */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 px-1">
          <h2 className={`text-2xl md:text-3xl font-serif font-bold text-center md:text-left ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Admin Dashboard</h2>
          <Button variant="secondary" onClick={handleLogout} className="w-full md:w-auto py-3 md:py-2 text-sm md:text-base shadow-sm"><LogOut size={18} /> Logout</Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">

          {/* --- NEW: Theme Manager Card --- */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Palette className="text-[var(--theme-primary)]" /> Theme Manager</h3>
            <p className="text-sm opacity-70 mb-4">Select a theme to update the app's colors and falling animation.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {THEMES.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => handleUpdateTheme(theme.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${siteConfig?.themeId === theme.id ? 'ring-2 ring-offset-2 ring-[var(--theme-primary)]' : ''} ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex gap-1 mb-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.primary }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ background: theme.secondary }}></div>
                  </div>
                  <span className="text-2xl mb-1">{theme.icon}</span>
                  <span className="text-[10px] font-bold text-center">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={`${cardClass} border-l-4 border-[var(--theme-secondary)]`}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Megaphone className="text-[var(--theme-secondary)]" /> Announcement Banner</h3>
            <form onSubmit={handleUpdateAnnouncement} className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <input name="annText" defaultValue={siteConfig?.announcementText} placeholder="Enter text..." className={`flex-grow p-2.5 border rounded outline-none w-full ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : ''}`} />
              <div className="flex items-center justify-between md:justify-start gap-3 whitespace-nowrap bg-gray-100/10 p-2 rounded"><span className="text-sm font-bold opacity-80">Show Banner?</span><input type="checkbox" name="annShow" defaultChecked={siteConfig?.showAnnouncement} className="w-5 h-5 accent-[var(--theme-primary)]" /></div>
              <Button className="py-2 text-sm w-full md:w-auto">Update</Button>
            </form>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><ImageIcon className="text-[var(--theme-primary)]" /> Manage Site Images</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[{ label: "Expert: Rupa", field: "expertRupa" }, { label: "Expert: Anupa", field: "expertAnupa" }].map(asset => (
                <div key={asset.field} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <label className="text-sm font-bold opacity-80 mb-2 block">{asset.label}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSiteImageSelect(e, asset.field)}
                    className="w-full text-xs opacity-70 mb-3"
                  />
                  <Button
                    onClick={() => handleSiteImageUpload(asset.field)}
                    disabled={!selectedSiteImages[asset.field]}
                    className="w-full py-1.5 text-xs h-auto"
                    variant={selectedSiteImages[asset.field] ? "primary" : "secondary"}
                  >
                    <UploadIcon size={14} className="mr-1" /> Upload Image
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><CheckCheckIcon className="text-[var(--theme-primary)]" /> Manage Categories</h3>
            {/* UPDATED: Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-grow flex gap-2">
                <input placeholder="New Category Name" className={inputClass} value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                <Button onClick={handleAddCategory} type="button">Add</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['Bridal', 'Hair', 'Skin'].map(cat => (
                <span key={cat} className={`px-3 py-1 rounded-full text-xs font-medium border capitalize cursor-default opacity-70 flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-400' : 'bg-gray-100 border-gray-200 text-gray-500'}`} title="Default category (cannot delete)">
                  {cat}
                </span>
              ))}
              {categoriesDocs.map((cat) => (
                <span key={cat.id} className={`pl-3 pr-1 py-1 rounded-full text-xs font-medium border capitalize flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
                  {cat.name}
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="hover:text-red-500 p-1 rounded-full hover:bg-black/10 transition-colors"
                    title="Delete Category"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageCircle className="text-[var(--theme-primary)]" /> Recent Queries</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={`border p-4 rounded-xl transition-all ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-bold block">{msg.name}</span>
                      <span className="text-xs opacity-60">
                        {getFormattedDate(msg.createdAt, msg.date)}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {/* Replaced dot color */}
                      <button onClick={() => handleToggleRead(msg.id, msg.isRead)} className="opacity-60 hover:opacity-100">{msg.isRead ? <CheckCircle size={18} /> : <div className="w-4 h-4 rounded-full bg-[var(--theme-primary)]"></div>}</button>
                      <button onClick={() => handleDeleteMessage(msg.id)} className="opacity-60 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </div>
                  <p className="text-sm opacity-80 mb-2 break-words">{msg.message}</p>
                  <button onClick={() => handleReply(msg.id, msg.phone, msg.name, msg.message)} className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200 hover:bg-green-100 flex items-center gap-1 w-fit"><MessageCircle size={12} /> Reply on WhatsApp</button>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass} id="service-form">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><Scissors className="text-[var(--theme-primary)]" /> Manage Services</h3>{editingService && <button onClick={() => setEditingService(null)} className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full">Cancel</button>}</div>
            <form key={editingService?.id} className={`p-4 rounded-xl mb-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} onSubmit={handleSaveService}>
              {/* UPDATED: Mobile friendly grid for inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input name="sTitle" defaultValue={editingService?.title} required placeholder="Title" className={inputClass} />
                <input name="sPrice" defaultValue={editingService?.price} required placeholder="Price" className={inputClass} />
                <select name="sIcon" defaultValue={editingService?.iconName} className={inputClass}>{Object.keys(ICON_MAP).map(k => <option key={k}>{k}</option>)}</select>
                <select name="sCategory" defaultValue={editingService?.category} className={inputClass}><option value="">Category</option>{galleryCategories.map(c => <option key={c}>{c}</option>)}</select>
              </div>
              <textarea name="sDesc" defaultValue={editingService?.description} required placeholder="Description..." className={`${inputClass} mb-3`} rows="2"></textarea>
              <Button className="w-full py-2 text-sm">{editingService ? 'Update' : 'Add'}</Button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(s => (
                // UPDATED: Improved flex layout for mobile lists preventing squash
                <div key={s.id} className={`flex items-start justify-between p-3 md:p-4 rounded-lg border group ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`}>
                  <div className="min-w-0 pr-2 flex-1">
                    <h4 className="font-bold truncate text-sm md:text-base">{s.title}</h4>
                    <p className="text-xs opacity-60 truncate">{s.price}</p>
                  </div>
                  <div className="flex gap-1 md:gap-2 shrink-0">
                    <button onClick={() => setEditingService(s)} className="text-blue-400 p-1.5 md:p-1 hover:bg-blue-50/10 rounded"><Pencil size={16} /></button>
                    <button onClick={() => handleToggleService(s.id, s.isHidden)} className="opacity-60 p-1.5 md:p-1 hover:bg-gray-100/10 rounded">{s.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    <button onClick={() => handleDeleteService(s.id)} className="text-red-400 p-1.5 md:p-1 hover:bg-red-50/10 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2"><Camera className="text-[var(--theme-primary)]" /> Manage Gallery</h3>
              {editingGalleryItem && <button onClick={() => setEditingGalleryItem(null)} className="text-xs bg-gray-200 text-black px-3 py-1 rounded-full font-medium hover:bg-gray-300 transition-colors">Cancel Edit</button>}
            </div>

            <p className="text-xs text-gray-500 mb-4">{editingGalleryItem ? "Editing Image Details" : "Drag and drop to reorder. Upload new images below."}</p>

            <form key={editingGalleryItem?.id || 'add'} className={`p-4 rounded-xl mb-6 border flex flex-col gap-3 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} ${editingGalleryItem ? 'ring-2 ring-[var(--theme-primary)]' : ''}`} onSubmit={handleSaveGallery}>
              {/* UPDATED: Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold opacity-60 ml-1 mb-1 block">Category</label>
                  <select name="gCat" defaultValue={editingGalleryItem?.category} className={inputClass}>{galleryCategories.map(c => <option key={c}>{c}</option>)}</select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold opacity-60 ml-1 mb-1 block">Link to Service (Optional)</label>
                  <select name="gService" defaultValue={editingGalleryItem?.serviceId || ""} className={inputClass}>
                    <option value="">None (General Gallery)</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input type="file" className={`w-full p-2 rounded border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} />
                {editingGalleryItem && <span className="text-xs opacity-50 italic">Leave empty to keep current</span>}
              </div>
              <Button className="py-2 text-sm w-full">{editingGalleryItem ? 'Update Image Details' : 'Add Image'}</Button>
            </form>

            {/* UPDATED: Better Grid for small screens (2 cols instead of 3) */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 rounded-lg border ${isDarkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`} style={{ scrollbarWidth: 'thin' }}>
              {gallery.length === 0 ? <p className="text-sm opacity-50 italic w-full text-center py-4 col-span-full">No images found.</p> : gallery.map((img, index) => (
                <div
                  key={img.id}
                  className={`relative rounded-lg overflow-hidden group h-28 w-full shadow-sm border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-200'} cursor-move ${editingGalleryItem?.id === img.id ? 'ring-2 ring-[var(--theme-primary)]' : ''}`}
                  draggable
                  onDragStart={(e) => (dragItem.current = index)}
                  onDragEnter={(e) => (dragOverItem.current = index)}
                  onDragEnd={handleSort}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <img src={img.url} className={`w-full h-full object-cover pointer-events-none ${img.isHidden ? 'opacity-50 grayscale' : ''}`} alt="" />

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => setEditingGalleryItem(img)} className="text-blue-400 hover:text-blue-300 bg-black/30 p-1.5 rounded-full backdrop-blur-sm" title="Edit Details"><Pencil size={14} /></button>
                    <button type="button" onClick={() => handleToggleGallery(img.id, img.isHidden)} className="text-white hover:text-yellow-400 bg-black/30 p-1.5 rounded-full backdrop-blur-sm">{img.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}</button>
                    <button type="button" onClick={() => handleDeleteGallery(img.id)} className="text-red-400 hover:text-red-500 bg-black/30 p-1.5 rounded-full backdrop-blur-sm"><Trash2 size={14} /></button>
                  </div>

                  <div className="absolute top-1 left-1 bg-black/40 text-white p-0.5 rounded opacity-60 group-hover:opacity-100">
                    <GripVertical size={12} />
                  </div>

                  <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 truncate px-1 backdrop-blur-sm">
                    {img.serviceName ? `* ${img.serviceName}` : img.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={cardClass} id="product-form">
            <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold flex items-center gap-2"><ShoppingBag className="text-[var(--theme-primary)]" /> Manage Products</h3>{editingProduct && <button onClick={() => setEditingProduct(null)} className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full">Cancel</button>}</div>
            <form key={editingProduct?.id} className={`p-4 rounded-xl mb-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'}`} onSubmit={handleSaveProduct}>
              {/* UPDATED: Stack inputs on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input name="pName" defaultValue={editingProduct?.name} required placeholder="Name" className={inputClass} />
                <input name="pPrice" defaultValue={editingProduct?.price.replace('₹', '')} required placeholder="Price" className={inputClass} />
              </div>
              <div className="mb-3"><input type="file" name="pImage" className={`w-full p-2 rounded border text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}`} accept="image/*" /></div>
              <textarea name="pDesc" defaultValue={editingProduct?.description} placeholder="Description..." className={`${inputClass} mb-3`} rows="2"></textarea>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select name="pCat" defaultValue={editingProduct?.category} className={inputClass}><option>Skincare</option><option>Haircare</option><option>Makeup</option><option>Accessories</option><option>Rental Items</option><option>Others</option></select>
                <select name="pStatus" defaultValue={editingProduct?.status} className={inputClass}><option value="In Stock">In Stock</option><option value="Sold Out">Sold Out</option><option value="Pre-order">Pre-order</option></select>
              </div>
              <Button className="w-full py-2 text-sm">{editingProduct ? 'Update' : 'Add'}</Button>
            </form>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {products.map(p => (
                // UPDATED: Improved flex layout for mobile
                <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100'} ${p.isHidden ? 'opacity-60' : ''}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img src={p.image} alt="" className="w-10 h-10 rounded object-cover shrink-0" />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <p className="text-xs opacity-60 truncate">{p.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2 items-center shrink-0 ml-2">
                    <button onClick={() => setEditingProduct(p)} className="text-blue-400 p-1.5 md:p-1 hover:bg-blue-50/10 rounded"><Pencil size={16} /></button>
                    <button onClick={() => handleToggleProduct(p.id, p.isHidden)} className="opacity-60 p-1.5 md:p-1 hover:bg-gray-100/10 rounded">{p.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 p-1.5 md:p-1 hover:bg-red-50/10 rounded"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- Main App ---

export default function RadianceApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [products, setProducts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [services, setServices] = useState([]);
  const [galleryCategories, setGalleryCategories] = useState(INITIAL_CATEGORIES);
  const [categoriesDocs, setCategoriesDocs] = useState([]); // NEW: Stores full docs with IDs
  const [messages, setMessages] = useState([]);
  const [siteConfig, setSiteConfig] = useState({});
  const [cart, setCart] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [user, setUser] = useState(null);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [queryForm, setQueryForm] = useState({ name: '', phone: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '', isVisible: false });
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // --- NEW: Theme State ---
  const [activeTheme, setActiveTheme] = useState(THEMES[0]);

  // --- NEW: Query Modal State (For Floating Action Button) ---
  const [isQueryModalOpen, setIsQueryModalOpen] = useState(false);

  // --- DARK MODE STATE ---
  const [isDarkMode, setIsDarkMode] = useState(false);

  // --- PWA INSTALL STATE ---
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Load Theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // --- NEW: Dynamic Theme Application ---
  useEffect(() => {
    const themeId = siteConfig?.themeId || 'default';
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    setActiveTheme(theme);

    // Apply CSS Variables to root
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);

    // Smooth transition
    root.style.setProperty('transition', 'background-color 0.5s ease, color 0.5s ease');

  }, [siteConfig?.themeId]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type: type, isVisible: true });
    setTimeout(() => {
      setNotification({ ...notification, isVisible: false });
    }, 3000);
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e) {
        console.warn("Auth initialization warning:", e);
      }
    };
    initAuth();

    const unsubAuth = onAuthStateChanged(auth, setUser);
    const unsubProducts = onSnapshot(collection(db, "products"), (s) => { setProducts(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoadingProducts(false); });
    const unsubServices = onSnapshot(collection(db, "services"), (s) => { setServices(s.docs.map(d => ({ id: d.id, ...d.data() }))); setLoadingServices(false); });
    const unsubGallery = onSnapshot(query(collection(db, "gallery"), orderBy("order", "asc")), (s) => {
      setGallery(s.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoadingGallery(false);
    });
    const unsubMessages = onSnapshot(query(collection(db, "messages"), orderBy("createdAt", "desc")), (s) => setMessages(s.docs.map(d => ({ id: d.id, ...d.data() }))));

    const unsubCategories = onSnapshot(collection(db, "categories"), (s) => {
      const docs = s.docs.map(d => ({ id: d.id, ...d.data() }));
      setCategoriesDocs(docs);
      const cats = docs.map(d => d.name);
      setGalleryCategories(['Bridal', 'Hair', 'Skin', ...cats]);
    });

    const unsubConfig = onSnapshot(doc(db, "site_settings", "config"), (doc) => { if (doc.exists()) setSiteConfig(doc.data()); });
    return () => { unsubAuth(); unsubProducts(); unsubServices(); unsubGallery(); unsubMessages(); unsubCategories(); unsubConfig(); };
  }, []);

  useEffect(() => {
    if (activeTab === 'home' && siteConfig?.showAnnouncement) {
      const hasSeen = sessionStorage.getItem('seenBanner');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setShowAnnouncement(true);
          sessionStorage.setItem('seenBanner', 'true');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [activeTab, siteConfig]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  const handleNav = (tab, sectionId = null, filter = null) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if (filter) setGalleryFilter(filter);
    if (sectionId && tab === 'home') setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => window.scrollTo(0, 0), [activeTab]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    try {
      const messageWithPrefix = `Inquiry: ${queryForm.message}`;
      await addDoc(collection(db, "messages"), {
        name: queryForm.name,
        phone: queryForm.phone,
        message: messageWithPrefix,
        isRead: false,
        isReplied: false,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString()
      });
      setQueryForm({ name: '', phone: '', message: '' });
      showNotification("Query sent successfully!", 'success');
    } catch (error) {
      showNotification("Error sending message.", 'error');
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 relative ${isDarkMode ? 'bg-[#121212] text-gray-100' : 'bg-[#FDFBF7] text-gray-800'}`}>

      {/* --- NEW: Global Floating Action Menu & Modal --- */}
      <FloatingActionMenu onOpenQuery={() => setIsQueryModalOpen(true)} isDarkMode={isDarkMode} />

      <QueryModal
        isOpen={isQueryModalOpen}
        onClose={() => setIsQueryModalOpen(false)}
        formData={queryForm}
        setFormData={setQueryForm}
        onSubmit={handleQuerySubmit}
        isDarkMode={isDarkMode}
      />

      {notification.isVisible && <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification({ ...notification, isVisible: false })} />}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} services={services} isDarkMode={isDarkMode} />
      <AnnouncementPopup config={siteConfig} isVisible={showAnnouncement} onClose={() => setShowAnnouncement(false)} />

      <InstallBanner
        isDarkMode={isDarkMode}
        isVisible={showInstallBanner}
        onInstall={handleInstallClick}
        onClose={() => setShowInstallBanner(false)}
      />

      {/* --- RENDER FALLING OVERLAY (Empty for now per request) --- */}
      <FallingOverlay icon={activeTheme.icon} />

      <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled
        ? (isDarkMode ? 'bg-[#1A1A1A]/95 shadow-md shadow-gray-900 py-2 top-0' : 'bg-white/95 shadow-md py-2 top-0')
        : 'bg-transparent py-4 top-0'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('home')}>
            {/* Replaced Logo border color */}
            <div className="w-11 h-11 rounded-full flex items-center justify-center border-2 border-[var(--theme-secondary)] bg-[#1a1a1a] shadow-lg">
              <img src="/logo.png" alt="Radiance" className="w-7 h-7 object-contain" />
            </div>

            <span className={`text-2xl font-serif font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#3D3D3D]'}`}>Radiance</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {/* Replaced active text color */}
            <button onClick={() => handleNav('home')} className={`font-medium transition-colors ${activeTab === 'home' ? 'text-[var(--theme-primary)]' : isDarkMode ? 'text-gray-300 hover:text-[var(--theme-primary)]' : 'text-gray-600 hover:text-[var(--theme-primary)]'}`}>Home</button>
            <button onClick={() => handleNav('home', 'about')} className={`font-medium transition-colors ${isDarkMode ? 'text-gray-300 hover:text-[var(--theme-primary)]' : 'text-gray-600 hover:text-[var(--theme-primary)]'}`}>About Us</button>
            <button onClick={() => handleNav('gallery', null, 'all')} className={`font-medium transition-colors ${activeTab === 'gallery' ? 'text-[var(--theme-primary)]' : isDarkMode ? 'text-gray-300 hover:text-[var(--theme-primary)]' : 'text-gray-600 hover:text-[var(--theme-primary)]'}`}>Gallery</button>
            <button onClick={() => handleNav('store')} className={`font-medium transition-colors ${activeTab === 'store' ? 'text-[var(--theme-primary)]' : isDarkMode ? 'text-gray-300 hover:text-[var(--theme-primary)]' : 'text-gray-600 hover:text-[var(--theme-primary)]'}`}>Product Store</button>

            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Button variant="primary" className="px-4 py-1.5 text-sm" onClick={() => setIsBookingOpen(true)}>Book Appointment</Button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-600'}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className={isDarkMode ? 'text-white' : 'text-[#3D3D3D]'} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden border-t absolute w-full shadow-lg ${isDarkMode ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex flex-col p-6 space-y-4">
              <button onClick={() => { handleNav('home'); setIsMenuOpen(false); }} className={`text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Home</button>
              <button onClick={() => { handleNav('home', 'about'); setIsMenuOpen(false); }} className={`text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>About Us</button>
              <button onClick={() => { handleNav('gallery'); setIsMenuOpen(false); }} className={`text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Gallery</button>
              <button onClick={() => { handleNav('store'); setIsMenuOpen(false); }} className={`text-left font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Product Store</button>
              {/* Replaced text color */}
              <button onClick={() => { setIsBookingOpen(true); setIsMenuOpen(false); }} className="text-left font-bold text-[var(--theme-primary)]">Book Appointment</button>

              {showInstallBanner && (
                <button
                  onClick={() => { handleInstallClick(); setIsMenuOpen(false); }}
                  className="text-left font-bold text-[#B3121A] flex items-center gap-2 mt-2 pt-4 border-t border-dashed border-gray-300/50"
                >
                  <div className="bg-[var(--theme-secondary)]/10 p-1.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

      {/* Main Content */}
      {activeTab === 'home' && (
        <HomeView
          handleNav={handleNav}
          queryForm={queryForm}
          setQueryForm={setQueryForm}
          handleQuerySubmit={handleQuerySubmit}
          services={services.length > 0 ? services : INITIAL_SERVICES}
          siteConfig={siteConfig}
          openBooking={() => setIsBookingOpen(true)}
          galleryCategories={galleryCategories}
          isLoading={loadingServices}
          isDarkMode={isDarkMode}
        />
      )}
      {activeTab === 'gallery' && (
        <GalleryView
          handleNav={handleNav} // Passed handleNav
          gallery={gallery.length > 0 ? gallery : INITIAL_GALLERY}
          galleryFilter={galleryFilter}
          setGalleryFilter={setGalleryFilter}
          galleryCategories={galleryCategories}
          services={services}
          isLoading={loadingGallery}
          isDarkMode={isDarkMode}
        />
      )}
      {activeTab === 'store' && (
        <StoreView
          handleNav={handleNav} // Passed handleNav
          products={products.length > 0 ? products : INITIAL_PRODUCTS}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          cart={cart}
          setCart={setCart}
          notify={showNotification}
          isLoading={loadingProducts}
          isDarkMode={isDarkMode}
        />
      )}
      {activeTab === 'admin' && (
        <AdminView
          user={user} adminEmail={adminEmail} setAdminEmail={setAdminEmail} adminPass={adminPass} setAdminPass={setAdminPass}
          messages={messages} setMessages={setMessages} products={products} setProducts={setProducts}
          gallery={gallery} setGallery={setGallery} services={services} setServices={setServices}
          galleryCategories={galleryCategories} setGalleryCategories={setGalleryCategories} categoriesDocs={categoriesDocs} siteConfig={siteConfig}
          notify={showNotification}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Footer */}
      <footer className={`py-8 md:py-12 border-t ${isDarkMode ? 'bg-[#0A0A0A] border-gray-800' : 'bg-[#2D2D2D] border-gray-700'} text-white`}>
        <div className="container mx-auto px-6 text-center">
          <div className="mb-6 flex justify-center gap-6">
            <a href="https://www.instagram.com/radiance_parlour_dto/" className="hover:text-[var(--theme-secondary)] transition-colors"><InstagramIcon /></a>
            <a href="#" className="hover:text-[var(--theme-secondary)] transition-colors"><FacebookIcon /></a>
          </div>
          <p className="text-gray-400 mb-2 text-[10px] xs:text-xs sm:text-sm">
            © 2025-26 Radiance Beauty Parlour. All rights reserved.
          </p>
          <button onClick={() => setActiveTab('admin')} className="text-xs text-gray-600 hover:text-gray-400 flex items-center justify-center gap-1 mx-auto"><User size={12} /> Login</button>
          <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
            Designed with <Heart size={12} className="text-red-500 fill-red-500 animate-pulse" /> by <a href="https://www.instagram.com/navneet_singh.31/" target="_blank" rel="noreferrer" className="text-[#FFD700] hover:underline font-bold">Nav</a>
          </p>
        </div>
      </footer>
    </div>
  );
}