import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Plus,
  Ban,
  ShoppingBag,
  Trash2,
  MessageCircle,
  X,
} from "lucide-react";
import Button from "../components/common/Button";
import { SkeletonCard } from "../components/common/Skeletons";
import { useApp } from "../context/AppContext";
import { CONTACT_CONFIG } from "../config/constants";

export const StorePage = () => {
  const {
    products,
    cart,
    addToCart,
    removeFromCart,
    loadingProducts,
    isDarkMode,
  } = useApp();

  const [storeCategory, setStoreCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isBagOpen, setIsBagOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = products.filter(
    (p) =>
      !p.isHidden &&
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (storeCategory === "all" || p.category === storeCategory)
  );

  const sendInquiry = () => {
    if (cart.length === 0) return;
    let message =
      "Hello Radiance Team! 👋\nI am interested in knowing the availability/details of these products:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.name} (${item.price})\n`;
    });
    message += "\nPlease let me know if they are available.";
    window.open(
      `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
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

        <div className="text-center mb-10 pt-8 md:pt-0">
          <h2
            className={`text-3xl md:text-4xl font-serif font-bold ${
              isDarkMode ? "text-white" : "text-[#3D3D3D]"
            }`}
          >
            Radiance Store
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1 md:mt-2">
            Browse our exclusive collection
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className={`w-full pl-12 pr-4 py-3 rounded-full border shadow-sm focus:ring-2 focus:ring-[var(--theme-primary)] outline-none ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-4 top-3.5 text-gray-400"
              size={20}
            />
          </div>

          {/* Store Categories */}
          <div
            className="flex overflow-x-auto pb-4 md:pb-0 md:flex-wrap md:justify-center gap-3 gap-y-3 mb-8 px-2 md:px-0 no-scrollbar"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {[
              "all",
              "Skincare",
              "Haircare",
              "Makeup",
              "Accessories",
              "Rental Items",
              "Others",
            ].map((cat) => (
              <button
                key={cat}
                onClick={() => setStoreCategory(cat)}
                className={`whitespace-nowrap flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  storeCategory === cat
                    ? "bg-[#3D3D3D] text-white shadow-md"
                    : isDarkMode
                    ? "bg-[#2A2A2A] text-gray-300 border-gray-700 border hover:border-[var(--theme-primary)]"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-[var(--theme-primary)]"
                }`}
              >
                {cat === "all" ? "All Products" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {loadingProducts
            ? Array(8)
                .fill(0)
                .map((_, i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
            : filteredProducts.map((product) => {
                const isOutOfStock = product.status !== "In Stock";
                return (
                  <div
                    key={product.id}
                    className={`rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full relative ${
                      isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
                    }`}
                  >
                    <div
                      className={`h-48 overflow-hidden relative ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
                          isOutOfStock ? "grayscale opacity-70" : ""
                        }`}
                        loading="lazy"
                      />
                      {isOutOfStock ? (
                        <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                          {product.status}
                        </span>
                      ) : (
                        product.status !== "In Stock" && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                            {product.status}
                          </span>
                        )
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <span className="text-xs font-bold text-[var(--theme-primary)] uppercase tracking-wide">
                        {product.category}
                      </span>
                      <h3
                        className={`font-bold text-lg mt-1 line-clamp-1 ${
                          isDarkMode ? "text-white" : "text-[#3D3D3D]"
                        }`}
                      >
                        {product.name}
                      </h3>
                      <div className="flex flex-col gap-2 mt-auto pt-4">
                        <div className="flex justify-between items-center">
                          <span
                            className={`text-lg font-bold ${
                              isOutOfStock
                                ? "text-gray-500"
                                : "text-[var(--theme-secondary)]"
                            }`}
                          >
                            {product.price}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            className="flex-1 py-1.5 text-xs px-2"
                            onClick={() => setSelectedProduct(product)}
                          >
                            Details
                          </Button>
                          <button
                            onClick={() => addToCart(product)}
                            disabled={isOutOfStock}
                            aria-label={`Add ${product.name} to inquiry bag`}
                            className={`text-white p-2 rounded-lg transition-colors shadow-sm flex items-center justify-center flex-1 ${
                              isOutOfStock
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[var(--theme-primary)] hover:brightness-110"
                            }`}
                          >
                            {isOutOfStock ? (
                              <Ban size={18} />
                            ) : (
                              <Plus size={18} />
                            )}
                            {isOutOfStock && (
                              <span className="ml-2 text-xs">Out</span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>

        {/* Floating Cart / Inquiry Bag Button */}
        {cart.length > 0 && (
          <div className="fixed bottom-24 right-6 z-40">
            <button
              onClick={() => setIsBagOpen(true)}
              aria-label="View Inquiry Bag"
              className="bg-[var(--theme-secondary)] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform relative flex items-center justify-center animate-bounce-slow"
            >
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                {cart.length}
              </span>
            </button>
          </div>
        )}

        {/* Cart / Inquiry Modal */}
        {isBagOpen && (
          <div
            className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsBagOpen(false)}
          >
            <div
              className={`rounded-t-2xl sm:rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-fade-in-up ${
                isDarkMode ? "bg-[#2A2A2A] text-white" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-[#3D3D3D] text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShoppingBag size={20} /> Your Inquiry Bag ({cart.length})
                </h3>
                <button
                  onClick={() => setIsBagOpen(false)}
                  aria-label="Close bag"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    Your bag is empty.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-gray-50 border-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            className="w-10 h-10 rounded object-cover"
                            alt={item.name}
                          />
                          <div>
                            <p
                              className={`font-bold text-sm line-clamp-1 ${
                                isDarkMode ? "text-white" : "text-gray-800"
                              }`}
                            >
                              {item.name}
                            </p>
                            <p className="text-xs text-[var(--theme-secondary)] font-bold">
                              {item.price}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(idx)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={`p-4 border-t ${
                  isDarkMode
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-100 bg-gray-50"
                }`}
              >
                <Button
                  className="w-full bg-[#25D366] hover:bg-[#128C7E]"
                  onClick={sendInquiry}
                >
                  <MessageCircle size={18} /> Send Inquiry via WhatsApp
                </Button>
                <p className="text-[10px] text-center text-gray-400 mt-2">
                  We will confirm availability & total price.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Product Detail Modal */}
        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-fade-in-up ${
                isDarkMode ? "bg-[#2A2A2A]" : "bg-white"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`relative h-64 md:h-72 ${
                  isDarkMode ? "bg-gray-800" : "bg-gray-100"
                }`}
              >
                <img
                  src={selectedProduct.image}
                  className="w-full h-full object-cover"
                  alt={selectedProduct.name}
                />
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 bg-white/80 p-2 rounded-full hover:bg-white transition-colors shadow-sm"
                  aria-label="Close product details"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 md:p-8">
                <h3
                  className={`text-2xl font-serif font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-[#3D3D3D]"
                  }`}
                >
                  {selectedProduct.name}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[var(--theme-primary)] font-medium bg-[#F2F7F6] px-3 py-1 rounded-full text-sm">
                    {selectedProduct.category}
                  </span>
                  <span className="text-xl font-bold text-[var(--theme-secondary)]">
                    {selectedProduct.price}
                  </span>
                </div>
                <p
                  className={`mb-6 text-sm md:text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {selectedProduct.description}
                </p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="secondary"
                    className="flex-1 py-3 text-sm md:text-base"
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
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

export default StorePage;
