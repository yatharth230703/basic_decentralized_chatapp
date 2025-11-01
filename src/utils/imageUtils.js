/**
 * Compress and resize image to Base64
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width (default: 500)
 * @param {number} maxHeight - Maximum height (default: 500)
 * @param {number} maxSizeKB - Maximum file size in KB (default: 200)
 * @returns {Promise<string>} Base64 string
 */
export const compressImageToBase64 = (file, maxWidth = 500, maxHeight = 500, maxSizeKB = 200) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to meet size limit
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);

        const checkSize = () => {
          const sizeKB = (base64.length * 3) / 4 / 1024;
          
          if (sizeKB <= maxSizeKB || quality <= 0.1) {
            resolve(base64);
          } else {
            quality -= 0.1;
            base64 = canvas.toDataURL('image/jpeg', quality);
            checkSize();
          }
        };

        checkSize();
      };

      img.onerror = reject;
      img.src = event.target.result;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {boolean} True if valid image
 */
export const isValidImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return validTypes.includes(file.type);
};

