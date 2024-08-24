import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firabse.init'; // Adjust the path to your firebase.init file

/**
 * Retrieves a file's download URL from Firebase Storage.
 *
 * @param filePath - The path to the file in Firebase Storage.
 * @returns A promise that resolves to the download URL of the file.
 */
const getFileFirebase = async (filePath: string): Promise<string> => {
  try {
    const fileRef = ref(storage, filePath); // Create a reference to the file location
    const url = await getDownloadURL(fileRef); // Get the file's download URL
    return url;
  } catch (error) {
    // console.error("Error getting file from Firebase Storage:", error);
    throw new Error('Error getting file from Firebase Storage');
  }
};

export { getFileFirebase };
