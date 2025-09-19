import { database } from '@/lib/firebase';
import { ref, get, set, child, push, remove, runTransaction } from 'firebase/database';
import type { Unit } from '@/lib/types';

const dbRef = ref(database);

const defaultEvents = [
    { name: "Event 1", score: 0 },
    { name: "Event 2", score: 0 },
];

export async function getUnits(): Promise<Unit[]> {
  try {
    const snapshot = await get(child(dbRef, 'units'));
    if (snapshot.exists()) {
      const unitsData = snapshot.val();
      return Object.keys(unitsData).map(key => ({
        id: key,
        ...unitsData[key],
        events: unitsData[key].events || defaultEvents, // Ensure events array exists
        score: undefined, // remove old score property if it exists
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
            const unitData = snapshot.val();
            return { 
                id, 
                ...unitData,
                events: unitData.events || defaultEvents,
                score: undefined,
            };
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
                const unitData = unitsData[unitId];
                return { 
                    id: unitId,
                    ...unitData,
                    events: unitData.events || defaultEvents,
                    score: undefined,
                };
            }
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function updateUnitScore(unitId: string, eventName: string, newScore: number): Promise<void> {
    try {
        const unitRef = child(dbRef, `units/${unitId}`);
        await runTransaction(unitRef, (unit) => {
            if (unit) {
                if (!unit.events) {
                    unit.events = defaultEvents;
                }
                const eventIndex = unit.events.findIndex((e: any) => e.name === eventName);
                if (eventIndex > -1) {
                    unit.events[eventIndex].score = newScore;
                } else {
                    unit.events.push({ name: eventName, score: newScore });
                }
            }
            return unit;
        });
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

export async function addUnit(unit: Omit<Unit, 'id' | 'events'> & { score: number }): Promise<string> {
    try {
        const newUnitRef = child(ref(database), 'units');
        const newUnitKey = push(newUnitRef).key;
        if (!newUnitKey) throw new Error("Failed to generate a new key for the unit");

        const unitToAdd = {
            name: unit.name,
            theme: unit.theme,
            photoAccessCount: 0,
            credentialId: unit.credentialId,
            events: [
              { name: "Event 1", score: unit.score || 0 },
              { name: "Event 2", score: 0 }
            ],
        };

        const unitRef = child(dbRef, `units/${newUnitKey}`);
        await set(unitRef, unitToAdd);
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
