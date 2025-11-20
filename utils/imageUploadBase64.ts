/**
 * Store images as compressed base64 strings in Firestore
 * This is a complete solution that doesn't require Firebase Storage
 */

/**
 * Compress and convert image file to base64 string
 * @param file - The image file to convert
 * @param maxWidth - Maximum width for the resized image (default: 200)
 * @param maxHeight - Maximum height for the resized image (default: 200)
 * @param quality - Image quality 0-1 (default: 0.7)
 * @returns Promise with compressed base64 string
 */
export const uploadProfilePictureBase64 = async (
  memberId: string, 
  file: File,
  maxWidth: number = 200,
  maxHeight: number = 200,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('Please upload an image file'));
        return;
      }

      // Limit original file size to 10MB
      if (file.size > 10 * 1024 * 1024) {
        reject(new Error('Image size must be less than 10MB'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          
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
          
          // Create canvas and resize image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          
          // Draw resized image
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const base64String = canvas.toDataURL('image/jpeg', quality);
          
          // Check final size (Firestore has 1MB limit per field)
          const sizeInBytes = (base64String.length * 3) / 4;
          if (sizeInBytes > 900 * 1024) { // 900KB to be safe
            reject(new Error('Compressed image is still too large. Try a smaller image.'));
            return;
          }
          
          resolve(base64String);
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read image file'));
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Delete profile picture (no-op for base64)
 */
export const deleteProfilePictureBase64 = async (memberId: string): Promise<void> => {
  // Nothing to delete for base64 storage
  return Promise.resolve();
};
