import { database } from '@/lib/firebase';
import { ref, get, set, child } from 'firebase/database';
import type { VenueDetails } from '@/lib/types';

const dbRef = ref(database);
const VENUE_PATH = 'venue';

/**
 * Fetches the current venue details from the database.
 * @returns A promise that resolves to the VenueDetails object or null if not found.
 */
export async function getVenueDetails(): Promise<VenueDetails | null> {
  try {
    const snapshot = await get(child(dbRef, VENUE_PATH));
    if (snapshot.exists()) {
      return snapshot.val() as VenueDetails;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching venue details:", error);
    throw error;
  }
}

/**
 * Updates the venue details in the database.
 * @param details The new venue details to save.
 * @returns A promise that resolves when the update is complete.
 */
export async function updateVenueDetails(details: VenueDetails): Promise<void> {
  if (!details || !details.roomNumber || !details.item) {
    throw new Error("Venue details must include a room number and an item.");
  }
  try {
    const venueRef = child(dbRef, VENUE_PATH);
    await set(venueRef, details);
  } catch (error) {
    console.error("Error updating venue details:", error);
    throw error;
  }
}