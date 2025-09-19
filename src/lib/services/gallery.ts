import { database } from '@/lib/firebase';
import { ref, get, child } from 'firebase/database';
import type { GalleryImage } from '@/lib/types';

const dbRef = ref(database);

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const snapshot = await get(child(dbRef, 'galleryImages'));
    if (snapshot.exists()) {
      const imagesData = snapshot.val();
      return Object.keys(imagesData).map(key => ({
        id: key,
        ...imagesData[key]
      }));
    } else {
      console.log("No images available");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
