import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

/**
 * Upload a profile picture to Firebase Storage
 * @param memberId - The ID of the member
 * @param file - The image file to upload
 * @returns The download URL of the uploaded image
 */
export const uploadProfilePicture = async (memberId: string, file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file');
    }

    // Limit file size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create a reference to the file in the 'uploads/profile-pictures/' folder
    const fileName = `${memberId}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `uploads/profile-pictures/${fileName}`);
    
    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: memberId,
        uploadedAt: new Date().toISOString()
      }
    };

    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

/**
 * Delete a profile picture from Firebase Storage
 * @param memberId - The ID of the member whose picture to delete
 */
export const deleteProfilePicture = async (memberId: string): Promise<void> => {
  try {
    // Try common image extensions
    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    
    for (const ext of extensions) {
      try {
        const storageRef = ref(storage, `uploads/profile-pictures/${memberId}.${ext}`);
        await deleteObject(storageRef);
        return; // If successful, exit
      } catch (error: any) {
        // Continue to next extension if file not found
        if (error.code !== 'storage/object-not-found') {
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    // Don't throw error if file doesn't exist
  }
};
