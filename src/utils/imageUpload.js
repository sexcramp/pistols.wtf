// Image upload & compression utility for pistols.wtf
// Handles device storage image uploads, client-side resizing/compression, and cloud storage upload fallback

/**
 * Reads a File object from device storage and compresses it client-side.
 * Ensures fast upload, instant preview, and saves safely in localStorage / DB.
 * 
 * @param {File} file - File object from <input type="file">
 * @param {Object} options - { maxWidth, maxHeight, quality }
 * @returns {Promise<string>} Base64 Data URL or public cloud URL
 */
export async function processImageUpload(file, options = {}) {
  const {
    maxWidth = 1000,
    maxHeight = 1000,
    quality = 0.85,
    isAvatar = false
  } = options;

  if (!file) {
    throw new Error('No file provided');
  }

  // Validate mime type
  if (!file.type.startsWith('image/')) {
    throw new Error('Please select an image file (PNG, JPG, WebP, GIF)');
  }

  // If file is GIF, do not resize via canvas to preserve animation frames
  if (file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  // For other images (PNG, JPG, WebP), compress via HTML5 canvas
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        // Calculate aspect ratio scale
        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(readerEvent.target.result);
          return;
        }

        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(image, 0, 0, width, height);

        // Convert to WebP or JPEG for optimal compression
        const outputFormat = file.type === 'image/png' && !isAvatar ? 'image/png' : 'image/webp';
        try {
          const dataUrl = canvas.toDataURL(outputFormat, quality);
          resolve(dataUrl);
        } catch (e) {
          // Fallback to original read
          resolve(readerEvent.target.result);
        }
      };
      image.onerror = (err) => reject(err);
      image.src = readerEvent.target.result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
