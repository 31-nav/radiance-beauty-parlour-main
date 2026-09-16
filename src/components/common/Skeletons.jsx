import React from "react";

export const SkeletonCard = ({ isDarkMode }) => (
  <div
    className={`${
      isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
    } p-6 rounded-2xl shadow-sm border h-full flex flex-col animate-pulse`}
  >
    <div
      className={`w-14 h-14 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-300"
      } rounded-full mb-4`}
    ></div>
    <div
      className={`h-6 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-300"
      } rounded w-3/4 mb-2`}
    ></div>
    <div
      className={`h-4 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-300"
      } rounded w-full mb-2`}
    ></div>
    <div
      className={`h-4 ${
        isDarkMode ? "bg-gray-700" : "bg-gray-300"
      } rounded w-5/6 mb-3`}
    ></div>
    <div className="mt-auto pt-2 flex justify-between items-center">
      <div
        className={`h-5 ${
          isDarkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-16`}
      ></div>
      <div
        className={`h-4 ${
          isDarkMode ? "bg-gray-700" : "bg-gray-300"
        } rounded w-12`}
      ></div>
    </div>
  </div>
);

export const SkeletonImage = ({ isDarkMode }) => (
  <div
    className={`aspect-square ${
      isDarkMode ? "bg-gray-800" : "bg-gray-200"
    } rounded-2xl animate-pulse w-full h-full relative overflow-hidden`}
  >
    <div
      className={`absolute inset-0 bg-gradient-to-r ${
        isDarkMode
          ? "from-gray-800 via-gray-700 to-gray-800"
          : "from-gray-200 via-gray-100 to-gray-200"
      } animate-[shimmer_1.5s_infinite]`}
    ></div>
  </div>
);
