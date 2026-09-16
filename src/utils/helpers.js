/**
 * Converts and compresses an image file to Base64 (max 800px dimension, 70% quality JPEG)
 * to keep Firestore document sizes low and performance snappy.
 */
export const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("Please select a valid image file."));
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
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
      const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image for processing."));
    };
    img.src = objectUrl;
  });
};

/**
 * Format Firestore timestamp or date string cleanly
 */
export const getFormattedDate = (timestamp, dateStr) => {
  if (timestamp && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }
  return dateStr || "Just now";
};
