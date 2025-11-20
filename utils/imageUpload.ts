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
    // Create a reference to the file in the 'uploads/profile-pictures/' folder
    const storageRef = ref(storage, `uploads/profile-pictures/${memberId}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    
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
    const storageRef = ref(storage, `uploads/profile-pictures/${memberId}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    // Don't throw error if file doesn't exist
    if ((error as any).code !== 'storage/object-not-found') {
      throw error;
    }
  }
};
