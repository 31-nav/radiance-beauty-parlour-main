import React from "react";
import { Sparkles, Megaphone } from "lucide-react";

export const StripeBanner = ({ text }) => {
  if (!text) return null;

  return (
    <div className="w-full bg-gradient-to-r from-[#B8860B] via-[#FFD700] to-[#B8860B] py-3 overflow-hidden shadow-lg my-8 relative z-20 border-y border-[#DAA520]">
      <div className="flex overflow-hidden w-full">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {Array(8)
            .fill(0)
            .map((_, i) => (
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

export default StripeBanner;
