import React, { useState, useRef } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  setDoc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import {
  LogOut,
  Palette,
  Megaphone,
  Image as ImageIcon,
  CheckCircle,
  X,
  Trash2,
  MessageCircle,
  Scissors,
  Pencil,
  Eye,
  EyeOff,
  Camera,
  GripVertical,
  ShoppingBag,
} from "lucide-react";
import Button from "../components/common/Button";
import { CheckCheckIcon, UploadIcon } from "../components/common/Icons";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { useApp } from "../context/AppContext";
import { auth, db } from "../config/firebase";
import { THEMES, ICON_MAP } from "../config/constants";
import { convertToBase64, getFormattedDate } from "../utils/helpers";

export const AdminPage = () => {
  const {
    user,
    ADMIN_UID,
    messages,
    products,
    gallery,
    setGallery,
    services,
    galleryCategories,
    categoriesDocs,
    siteConfig,
    showNotification,
    isDarkMode,
  } = useApp();

  const [adminEmail, setAdminEmail] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [selectedSiteImages, setSelectedSiteImages] = useState({});

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    action: null,
    message: "",
  });

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const confirmAction = (action, message) => {
    setConfirmModal({ isOpen: true, action, message });
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPass);
      setLoginError("");
    } catch (error) {
      setLoginError("Login failed. Please verify your credentials.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  // Queries actions
  const handleToggleRead = async (id, currentStatus) => {
    await updateDoc(doc(db, "messages", id), { isRead: !currentStatus });
  };

  const handleDeleteMessage = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "messages", id));
      showNotification("Message deleted", "success");
    }, "Delete this query?");
  };

  const handleReply = async (id, phone, name, userMessage) => {
    await updateDoc(doc(db, "messages", id), { isReplied: true, isRead: true });
    const replyText = `Hello ${name}, thank you for contacting Radiance Beauty Parlour! ✨\n\nRegarding your query: "${userMessage}"\n\nWe are here to help!\n\n .....\n\nBest regards,\nRadiance Team 🫰`;
    const cleanPhone = phone.replace(/\D/g, "").replace(/^0+/, "");
    const finalPhone =
      cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(
      `https://wa.me/${finalPhone}?text=${encodeURIComponent(replyText)}`,
      "_blank"
    );
  };

  // Service CRUD
  const handleSaveService = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.sTitle.value,
      price: form.sPrice.value,
      description: form.sDesc.value,
      iconName: form.sIcon.value,
      category: form.sCategory.value || "all",
    };
    try {
      if (editingService) {
        await updateDoc(doc(db, "services", editingService.id), data);
        showNotification("Service Updated!", "success");
        setEditingService(null);
      } else {
        await addDoc(collection(db, "services"), {
          ...data,
          isHidden: false,
          createdAt: serverTimestamp(),
        });
        showNotification("Service Added!", "success");
      }
      form.reset();
    } catch (err) {
      showNotification("Error saving service", "error");
    }
  };

  const handleDeleteService = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "services", id));
      showNotification("Service Deleted", "success");
    }, "Delete this service?");
  };

  const handleToggleService = async (id, val) => {
    await updateDoc(doc(db, "services", id), { isHidden: !val });
  };

  // Categories
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (
      newCategory.trim() &&
      !galleryCategories.includes(newCategory.toLowerCase())
    ) {
      await addDoc(collection(db, "categories"), {
        name: newCategory.toLowerCase(),
      });
      setNewCategory("");
      showNotification("Category Added!", "success");
    }
  };

  const handleDeleteCategory = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "categories", id));
      showNotification("Category Deleted", "success");
    }, "Delete this category? This might affect existing services/images.");
  };

  // Product CRUD
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.pImage.files[0];
    if (file) {
      try {
        let img = await convertToBase64(file);
        const data = {
          name: form.pName.value,
          price: form.pPrice.value,
          category: form.pCat.value,
          image: img,
          description: form.pDesc.value,
          status: form.pStatus.value,
        };
        if (editingProduct) {
          await updateDoc(doc(db, "products", editingProduct.id), data);
          showNotification("Product Updated", "success");
          setEditingProduct(null);
        } else {
          await addDoc(collection(db, "products"), {
            ...data,
            isHidden: false,
            createdAt: serverTimestamp(),
          });
          showNotification("Product Added", "success");
        }
        form.reset();
      } catch (err) {
        showNotification("Error saving product: " + err.message, "error");
      }
    } else {
      if (editingProduct) {
        const data = {
          name: form.pName.value,
          price: form.pPrice.value,
          category: form.pCat.value,
          description: form.pDesc.value,
          status: form.pStatus.value,
        };
        try {
          await updateDoc(doc(db, "products", editingProduct.id), data);
          showNotification("Product Updated", "success");
          setEditingProduct(null);
          form.reset();
        } catch (err) {
          showNotification("Error updating product", "error");
        }
      } else {
        showNotification("Please select an image for new products", "error");
      }
    }
  };

  const handleDeleteProduct = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "products", id));
      showNotification("Product Deleted", "success");
    }, "Delete this product?");
  };

  const handleToggleProduct = async (id, val) => {
    await updateDoc(doc(db, "products", id), { isHidden: !val });
  };

  // Gallery CRUD & Drag-Drop Sorting
  const handleSaveGallery = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.querySelector('input[type="file"]').files[0];
    const category = form.gCat.value;
    const serviceId = form.gService.value;

    let docData = { category };

    if (serviceId) {
      const selected = services.find((s) => s.id === serviceId);
      if (selected) {
        docData.serviceId = serviceId;
        docData.serviceName = selected.title;
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
        if (file) {
          const img = await convertToBase64(file);
          docData.url = img;
        }
        await updateDoc(doc(db, "gallery", editingGalleryItem.id), docData);
        showNotification("Image Updated!", "success");
        setEditingGalleryItem(null);
      } else {
        if (!file) return showNotification("Please select an image", "error");

        const img = await convertToBase64(file);
        docData.url = img;
        docData.isHidden = false;
        docData.createdAt = serverTimestamp();

        const newOrder =
          gallery.length > 0
            ? Math.max(...gallery.map((g) => g.order || 0)) + 1
            : 0;
        docData.order = newOrder;

        await addDoc(collection(db, "gallery"), docData);
        showNotification("Image Added!", "success");
      }
      form.reset();
    } catch (error) {
      console.error("Gallery Save Error:", error);
      showNotification("Error saving image: " + error.message, "error");
    }
  };

  const handleDeleteGallery = (id) => {
    confirmAction(async () => {
      await deleteDoc(doc(db, "gallery", id));
      showNotification("Image Deleted", "success");
    }, "Delete this gallery image?");
  };

  const handleToggleGallery = async (id, val) => {
    await updateDoc(doc(db, "gallery", id), { isHidden: !val });
  };

  const handleSort = () => {
    let items = [...gallery];
    const draggedItemContent = items.splice(dragItem.current, 1)[0];
    items.splice(dragOverItem.current, 0, draggedItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setGallery(items);
    saveGalleryOrder(items);
  };

  const saveGalleryOrder = async (items) => {
    try {
      const batch = writeBatch(db);
      items.forEach((item, index) => {
        const docRef = doc(db, "gallery", item.id);
        batch.update(docRef, { order: index });
      });
      await batch.commit();
      showNotification("Gallery order updated!", "success");
    } catch (error) {
      console.error("Error updating order:", error);
      showNotification("Failed to save order.", "error");
    }
  };

  // Site Settings & Images
  const handleSiteImageSelect = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedSiteImages((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleSiteImageUpload = async (field) => {
    const file = selectedSiteImages[field];
    if (!file) return;

    try {
      const base64 = await convertToBase64(file);
      await setDoc(
        doc(db, "site_settings", "config"),
        { [field]: base64 },
        { merge: true }
      );
      showNotification("Image uploaded successfully!", "success");
      setSelectedSiteImages((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    } catch (e) {
      showNotification("Error uploading image: " + e.message, "error");
    }
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    const text = e.target.annText.value;
    const show = e.target.annShow.checked;
    await setDoc(
      doc(db, "site_settings", "config"),
      { announcementText: text, showAnnouncement: show },
      { merge: true }
    );
    showNotification("Announcement Updated!", "success");
  };

  const handleUpdateTheme = async (themeId) => {
    await setDoc(
      doc(db, "site_settings", "config"),
      { themeId },
      { merge: true }
    );
    showNotification("Theme Updated!", "success");
  };

  const cardClass = `p-4 md:p-6 rounded-2xl shadow-md lg:col-span-2 border-l-4 border-[var(--theme-primary)] ${
    isDarkMode ? "bg-[#2A2A2A] text-white" : "bg-white"
  }`;
  const inputClass = `w-full p-2.5 rounded border text-sm outline-none ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white"
      : "bg-white border-gray-200 text-gray-800"
  }`;

  // Unauthenticated Admin View
  if (!user) {
    return (
      <div className="pt-32 pb-20 px-6 min-h-screen flex items-center justify-center">
        <div
          className={`p-8 rounded-2xl shadow-xl w-full max-w-md border ${
            isDarkMode
              ? "bg-[#2A2A2A] border-gray-700"
              : "bg-white border-gray-100"
          }`}
        >
          <h2
            className={`text-2xl font-serif font-bold mb-6 text-center ${
              isDarkMode ? "text-white" : "text-[#3D3D3D]"
            }`}
          >
            Admin Login
          </h2>
          <div className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)] ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              }`}
              value={adminEmail}
              onChange={(e) => {
                setAdminEmail(e.target.value);
                setLoginError("");
              }}
            />
            <input
              type="password"
              placeholder="Password"
              className={`w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[var(--theme-primary)] ${
                isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
              }`}
              value={adminPass}
              onChange={(e) => {
                setAdminPass(e.target.value);
                setLoginError("");
              }}
            />
            {loginError && (
              <div className="text-red-500 text-sm text-center">
                {loginError}
              </div>
            )}
            <Button className="w-full" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Access Denied if not matching ADMIN_UID
  if (user.uid !== ADMIN_UID) {
    return (
      <div className="pt-32 text-center text-xl font-bold min-h-screen">
        Access Denied. You do not have administrator permissions.
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div
      className={`pt-24 pb-20 px-4 md:px-6 min-h-screen ${
        isDarkMode ? "bg-[#121212]" : "bg-gray-50"
      }`}
    >
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.action}
        message={confirmModal.message}
      />
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 px-1">
          <h2
            className={`text-2xl md:text-3xl font-serif font-bold text-center md:text-left ${
              isDarkMode ? "text-white" : "text-[#3D3D3D]"
            }`}
          >
            Admin Dashboard
          </h2>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="w-full md:w-auto py-3 md:py-2 text-sm md:text-base shadow-sm"
          >
            <LogOut size={18} /> Logout
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          {/* Theme Manager Card */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Palette className="text-[var(--theme-primary)]" /> Theme Manager
            </h3>
            <p className="text-sm opacity-70 mb-4">
              Select a theme to update the app's colors and falling animation.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleUpdateTheme(theme.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all hover:scale-105 ${
                    siteConfig?.themeId === theme.id
                      ? "ring-2 ring-offset-2 ring-[var(--theme-primary)]"
                      : ""
                  } ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: theme.primary }}
                    ></div>
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ background: theme.secondary }}
                    ></div>
                  </div>
                  <span className="text-2xl mb-1">{theme.icon}</span>
                  <span className="text-[10px] font-bold text-center">
                    {theme.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Announcement Banner Card */}
          <div
            className={`${cardClass} border-l-4 border-[var(--theme-secondary)]`}
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Megaphone className="text-[var(--theme-secondary)]" /> Announcement
              Banner
            </h3>
            <form
              onSubmit={handleUpdateAnnouncement}
              className="flex flex-col md:flex-row gap-4 items-stretch md:items-center"
            >
              <input
                name="annText"
                defaultValue={siteConfig?.announcementText}
                placeholder="Enter announcement text..."
                className={`flex-grow p-2.5 border rounded outline-none w-full ${
                  isDarkMode ? "bg-gray-700 border-gray-600 text-white" : ""
                }`}
              />
              <div className="flex items-center justify-between md:justify-start gap-3 whitespace-nowrap bg-gray-100/10 p-2 rounded">
                <span className="text-sm font-bold opacity-80">
                  Show Banner?
                </span>
                <input
                  type="checkbox"
                  name="annShow"
                  defaultChecked={siteConfig?.showAnnouncement}
                  className="w-5 h-5 accent-[var(--theme-primary)]"
                />
              </div>
              <Button className="py-2 text-sm w-full md:w-auto">Update</Button>
            </form>
          </div>

          {/* Manage Site Images Card */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ImageIcon className="text-[var(--theme-primary)]" /> Manage Site
              Images
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Expert: Rupa", field: "expertRupa" },
                { label: "Expert: Anupa", field: "expertAnupa" },
              ].map((asset) => (
                <div
                  key={asset.field}
                  className={`p-4 rounded-xl border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <label className="text-sm font-bold opacity-80 mb-2 block">
                    {asset.label}
                  </label>
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
                    variant={
                      selectedSiteImages[asset.field] ? "primary" : "secondary"
                    }
                  >
                    <UploadIcon size={14} className="mr-1" /> Upload Image
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Categories Card */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCheckIcon className="text-[var(--theme-primary)]" /> Manage
              Categories
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-grow flex gap-2">
                <input
                  placeholder="New Category Name"
                  className={inputClass}
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button onClick={handleAddCategory} type="button">
                  Add
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Bridal", "Hair", "Skin"].map((cat) => (
                <span
                  key={cat}
                  className={`px-3 py-1 rounded-full text-xs font-medium border capitalize cursor-default opacity-70 flex items-center gap-1 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-400"
                      : "bg-gray-100 border-gray-200 text-gray-500"
                  }`}
                  title="Default category (cannot delete)"
                >
                  {cat}
                </span>
              ))}
              {categoriesDocs.map((cat) => (
                <span
                  key={cat.id}
                  className={`pl-3 pr-1 py-1 rounded-full text-xs font-medium border capitalize flex items-center gap-1 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-gray-300"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                  }`}
                >
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

          {/* Recent Queries Card */}
          <div className={cardClass}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageCircle className="text-[var(--theme-primary)]" /> Recent
              Queries
            </h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
              {messages.length === 0 ? (
                <p className="text-sm opacity-50 italic py-4 text-center">
                  No queries received yet.
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`border p-4 rounded-xl transition-all ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700"
                        : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="font-bold block">{msg.name}</span>
                        <span className="text-xs opacity-60">
                          {getFormattedDate(msg.createdAt, msg.date)}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleRead(msg.id, msg.isRead)}
                          className="opacity-60 hover:opacity-100"
                          title="Toggle Read"
                        >
                          {msg.isRead ? (
                            <CheckCircle size={18} />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-[var(--theme-primary)]"></div>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="opacity-60 hover:text-red-500"
                          title="Delete Query"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm opacity-80 mb-2 break-words">
                      {msg.message}
                    </p>
                    <button
                      onClick={() =>
                        handleReply(msg.id, msg.phone, msg.name, msg.message)
                      }
                      className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-200 hover:bg-green-100 flex items-center gap-1 w-fit"
                    >
                      <MessageCircle size={12} /> Reply on WhatsApp
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manage Services Card */}
          <div className={cardClass} id="service-form">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Scissors className="text-[var(--theme-primary)]" /> Manage
                Services
              </h3>
              {editingService && (
                <button
                  onClick={() => setEditingService(null)}
                  className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
            <form
              key={editingService?.id}
              className={`p-4 rounded-xl mb-6 border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-100"
              }`}
              onSubmit={handleSaveService}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input
                  name="sTitle"
                  defaultValue={editingService?.title}
                  required
                  placeholder="Title"
                  className={inputClass}
                />
                <input
                  name="sPrice"
                  defaultValue={editingService?.price}
                  required
                  placeholder="Price"
                  className={inputClass}
                />
                <select
                  name="sIcon"
                  defaultValue={editingService?.iconName}
                  className={inputClass}
                >
                  {Object.keys(ICON_MAP).map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
                <select
                  name="sCategory"
                  defaultValue={editingService?.category}
                  className={inputClass}
                >
                  <option value="">Category</option>
                  {galleryCategories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <textarea
                name="sDesc"
                defaultValue={editingService?.description}
                required
                placeholder="Description..."
                className={`${inputClass} mb-3`}
                rows="2"
              ></textarea>
              <Button className="w-full py-2 text-sm">
                {editingService ? "Update" : "Add"}
              </Button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((s) => (
                <div
                  key={s.id}
                  className={`flex items-start justify-between p-3 md:p-4 rounded-lg border group ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div className="min-w-0 pr-2 flex-1">
                    <h4 className="font-bold truncate text-sm md:text-base">
                      {s.title}
                    </h4>
                    <p className="text-xs opacity-60 truncate">{s.price}</p>
                  </div>
                  <div className="flex gap-1 md:gap-2 shrink-0">
                    <button
                      onClick={() => setEditingService(s)}
                      className="text-blue-400 p-1.5 md:p-1 hover:bg-blue-50/10 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleService(s.id, s.isHidden)}
                      className="opacity-60 p-1.5 md:p-1 hover:bg-gray-100/10 rounded"
                    >
                      {s.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteService(s.id)}
                      className="text-red-400 p-1.5 md:p-1 hover:bg-red-50/10 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manage Gallery Card */}
          <div className={cardClass}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Camera className="text-[var(--theme-primary)]" /> Manage Gallery
              </h3>
              {editingGalleryItem && (
                <button
                  onClick={() => setEditingGalleryItem(null)}
                  className="text-xs bg-gray-200 text-black px-3 py-1 rounded-full font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <p className="text-xs text-gray-500 mb-4">
              {editingGalleryItem
                ? "Editing Image Details"
                : "Drag and drop to reorder. Upload new images below."}
            </p>

            <form
              key={editingGalleryItem?.id || "add"}
              className={`p-4 rounded-xl mb-6 border flex flex-col gap-3 ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-100"
              } ${editingGalleryItem ? "ring-2 ring-[var(--theme-primary)]" : ""}`}
              onSubmit={handleSaveGallery}
            >
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="text-xs font-bold opacity-60 ml-1 mb-1 block">
                    Category
                  </label>
                  <select
                    name="gCat"
                    defaultValue={editingGalleryItem?.category}
                    className={inputClass}
                  >
                    {galleryCategories.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs font-bold opacity-60 ml-1 mb-1 block">
                    Link to Service (Optional)
                  </label>
                  <select
                    name="gService"
                    defaultValue={editingGalleryItem?.serviceId || ""}
                    className={inputClass}
                  >
                    <option value="">None (General Gallery)</option>
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  className={`w-full p-2 rounded border text-sm ${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  }`}
                />
                {editingGalleryItem && (
                  <span className="text-xs opacity-50 italic">
                    Leave empty to keep current
                  </span>
                )}
              </div>
              <Button className="py-2 text-sm w-full">
                {editingGalleryItem ? "Update Image Details" : "Add Image"}
              </Button>
            </form>

            <div
              className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2 rounded-lg border ${
                isDarkMode
                  ? "border-gray-700 bg-gray-800/50"
                  : "border-gray-200 bg-gray-50"
              }`}
              style={{ scrollbarWidth: "thin" }}
            >
              {gallery.length === 0 ? (
                <p className="text-sm opacity-50 italic w-full text-center py-4 col-span-full">
                  No images found.
                </p>
              ) : (
                gallery.map((img, index) => (
                  <div
                    key={img.id}
                    className={`relative rounded-lg overflow-hidden group h-28 w-full shadow-sm border ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-gray-200 border-gray-200"
                    } cursor-move ${
                      editingGalleryItem?.id === img.id
                        ? "ring-2 ring-[var(--theme-primary)]"
                        : ""
                    }`}
                    draggable
                    onDragStart={() => (dragItem.current = index)}
                    onDragEnter={() => (dragOverItem.current = index)}
                    onDragEnd={handleSort}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <img
                      src={img.url}
                      className={`w-full h-full object-cover pointer-events-none ${
                        img.isHidden ? "opacity-50 grayscale" : ""
                      }`}
                      alt=""
                    />

                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => setEditingGalleryItem(img)}
                        className="text-blue-400 hover:text-blue-300 bg-black/30 p-1.5 rounded-full backdrop-blur-sm"
                        title="Edit Details"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleGallery(img.id, img.isHidden)}
                        className="text-white hover:text-yellow-400 bg-black/30 p-1.5 rounded-full backdrop-blur-sm"
                      >
                        {img.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGallery(img.id)}
                        className="text-red-400 hover:text-red-500 bg-black/30 p-1.5 rounded-full backdrop-blur-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="absolute top-1 left-1 bg-black/40 text-white p-0.5 rounded opacity-60 group-hover:opacity-100">
                      <GripVertical size={12} />
                    </div>

                    <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] text-center py-0.5 truncate px-1 backdrop-blur-sm">
                      {img.serviceName ? `* ${img.serviceName}` : img.category}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Manage Products Card */}
          <div className={cardClass} id="product-form">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="text-[var(--theme-primary)]" /> Manage
                Products
              </h3>
              {editingProduct && (
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-xs bg-gray-200 text-black px-2 py-1 rounded-full"
                >
                  Cancel
                </button>
              )}
            </div>
            <form
              key={editingProduct?.id}
              className={`p-4 rounded-xl mb-6 border ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-gray-50 border-gray-100"
              }`}
              onSubmit={handleSaveProduct}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input
                  name="pName"
                  defaultValue={editingProduct?.name}
                  required
                  placeholder="Name"
                  className={inputClass}
                />
                <input
                  name="pPrice"
                  defaultValue={editingProduct?.price?.replace("₹", "")}
                  required
                  placeholder="Price"
                  className={inputClass}
                />
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  name="pImage"
                  className={`w-full p-2 rounded border text-sm ${
                    isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white"
                  }`}
                  accept="image/*"
                />
              </div>
              <textarea
                name="pDesc"
                defaultValue={editingProduct?.description}
                placeholder="Description..."
                className={`${inputClass} mb-3`}
                rows="2"
              ></textarea>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <select
                  name="pCat"
                  defaultValue={editingProduct?.category}
                  className={inputClass}
                >
                  <option>Skincare</option>
                  <option>Haircare</option>
                  <option>Makeup</option>
                  <option>Accessories</option>
                  <option>Rental Items</option>
                  <option>Others</option>
                </select>
                <select
                  name="pStatus"
                  defaultValue={editingProduct?.status}
                  className={inputClass}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Sold Out">Sold Out</option>
                  <option value="Pre-order">Pre-order</option>
                </select>
              </div>
              <Button className="w-full py-2 text-sm">
                {editingProduct ? "Update" : "Add"}
              </Button>
            </form>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`flex justify-between items-center p-3 rounded-lg border ${
                    isDarkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-gray-50 border-gray-100"
                  } ${p.isHidden ? "opacity-60" : ""}`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-sm truncate">{p.name}</p>
                      <p className="text-xs opacity-60 truncate">{p.price}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 md:gap-2 items-center shrink-0 ml-2">
                    <button
                      onClick={() => setEditingProduct(p)}
                      className="text-blue-400 p-1.5 md:p-1 hover:bg-blue-50/10 rounded"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleToggleProduct(p.id, p.isHidden)}
                      className="opacity-60 p-1.5 md:p-1 hover:bg-gray-100/10 rounded"
                    >
                      {p.isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-400 p-1.5 md:p-1 hover:bg-red-50/10 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
