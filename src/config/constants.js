import {
  Sparkles,
  Scissors,
  Heart,
  Star,
  Clock,
  User,
} from "lucide-react";
import profileImg from "../image/profile 1.jpeg";

export const THEMES = [
  {
    id: "default",
    name: "Ruby Red",
    primary: "#E63946",
    secondary: "#A8DADC",
    icon: "❤️",
  },
  {
    id: "radiance",
    name: "Radiance Gold",
    primary: "#B8860B",
    secondary: "#FFD700",
    icon: "✨",
  },
  {
    id: "rose",
    name: "Royal Rose",
    primary: "#D63384",
    secondary: "#FFC107",
    icon: "💄",
  },
  {
    id: "midnight",
    name: "Midnight Elegance",
    primary: "#1E293B",
    secondary: "#F59E0B",
    icon: "⭐",
  },
];

export const ICON_MAP = {
  Sparkles,
  Scissors,
  Heart,
  Star,
  Clock,
  User,
};

export const INITIAL_CATEGORIES = ["Bridal", "Hair", "Skin"];
export const INITIAL_PRODUCTS = [];
export const INITIAL_SERVICES = [];
export const INITIAL_GALLERY = [];

export const TEAM_MEMBERS = [
  {
    name: "Rupa Singh",
    role: "Hair Specialist",
    certification: "Advanced Hair Styling Cert.",
    image: profileImg,
  },
  {
    name: "Anupa Singh",
    role: "Senior Beautician",
    certification: "Certified Makeup Artist",
    image: profileImg,
  },
];

export const CONTACT_CONFIG = {
  phone: "+916207413198",
  phoneSecondary: "+918340677007",
  whatsapp: "916207413198",
  locationName: "Radiance Beauty Parlour",
  locationAddress: "Near TV Tower Bairiya, Daltonganj, Jharkhand, India - 822101",
  locationMapUrl:
    "https://www.google.com/maps/search/?api=1&query=Radiance+Beauty+Parlour+Near+TV+Tower+Bairiya+Daltonganj+Jharkhand",
  instagramUrl: "https://www.instagram.com/radiance_parlour_dto/",
  instagramHandle: "@radiance_parlour_dto",
  hours: "9:30 AM - 08:00 PM",
  days: "Monday - Sunday (7 Days a Week)",
};
