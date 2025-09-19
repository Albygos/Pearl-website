import { database } from '@/lib/firebase';
import { ref, get, set, child, push, remove, runTransaction } from 'firebase/database';
import type { Unit } from '@/lib/types';

const dbRef = ref(database);

export async function getUnits(): Promise<Unit[]> {
  try {
    const snapshot = await get(child(dbRef, 'units'));
    if (snapshot.exists()) {
      const unitsData = snapshot.val();
      return Object.keys(unitsData).map(key => ({
        id: key,
        ...unitsData[key]
      }));
    } else {
      console.log("No data available");
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUnit(id: string): Promise<Unit | null> {
    try {
        const snapshot = await get(child(dbRef, `units/${id}`));
        if (snapshot.exists()) {
            return { id, ...snapshot.val() };
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getUnitByCredential(credentialId: string): Promise<Unit | null> {
    try {
        const snapshot = await get(child(dbRef, 'units'));
        if (snapshot.exists()) {
            const unitsData = snapshot.val();
            const unitId = Object.keys(unitsData).find(key => unitsData[key].credentialId === credentialId);
            if (unitId) {
                return { id: unitId, ...unitsData[unitId] };
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function updateUnitScore(id: string, newScore: number): Promise<void> {
    try {
        const unitRef = child(dbRef, `units/${id}/score`);
        await set(unitRef, newScore);
    } catch (error) {
        console.error("Error updating score:", error);
        throw error;
    }
}

export async function incrementUnitPhotoAccessCount(id: string): Promise<void> {
    try {
        const unitRef = child(dbRef, `units/${id}/photoAccessCount`);
        await runTransaction(unitRef, (currentCount) => {
            return (currentCount || 0) + 1;
        });
    } catch (error) {
        console.error("Error incrementing photo access count:", error);
        // Don't throw, as this is not a critical failure
    }
}

export async function addUnit(unit: Omit<Unit, 'id'>): Promise<string> {
    try {
        const newUnitRef = child(ref(database), 'units');
        const newUnitKey = push(newUnitRef).key;
        if (!newUnitKey) throw new Error("Failed to generate a new key for the unit");

        const unitRef = child(dbRef, `units/${newUnitKey}`);
        await set(unitRef, unit);
        return newUnitKey;
    } catch (error) {
        console.error("Error adding unit:", error);
        throw error;
    }
}

export async function deleteUnit(id: string): Promise<void> {
    try {
        const unitRef = child(dbRef, `units/${id}`);
        await remove(unitRef);
    } catch (error) {
        console.error("Error deleting unit:", error);
        throw error;
    }
}
