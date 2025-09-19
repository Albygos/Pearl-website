import { database } from '@/lib/firebase';
import { ref, get, set, child, push, remove } from 'firebase/database';
import type { AppEvent, Unit } from '@/lib/types';
import { getUnits, updateUnitEvents } from './units';

const dbRef = ref(database);

export async function getEvents(): Promise<AppEvent[]> {
  try {
    const snapshot = await get(child(dbRef, 'events'));
    if (snapshot.exists()) {
      const eventsData = snapshot.val();
      return Object.keys(eventsData).map(key => ({
        id: key,
        ...eventsData[key]
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addEvent(eventName: string): Promise<string> {
  if (!eventName) {
    throw new Error("Event name cannot be empty.");
  }
  try {
    // Add the new event to the /events node
    const eventsRef = child(dbRef, 'events');
    const newEventRef = push(eventsRef);
    await set(newEventRef, { name: eventName });
    const newEventId = newEventRef.key;
    if (!newEventId) throw new Error("Failed to get new event key");

    // Add the new event to all existing units with a score of 0
    const units = await getUnits();
    const updatePromises = units.map(unit => {
      const newEvent = { name: eventName, score: 0 };
      const updatedEvents = [...unit.events, newEvent];
      return updateUnitEvents(unit.id, updatedEvents);
    });
    await Promise.all(updatePromises);
    
    return newEventId;
  } catch(error) {
    console.error("Error adding event: ", error);
    throw error;
  }
}

export async function deleteEvent(eventId: string, eventName: string): Promise<void> {
    try {
        // Delete the event from the /events node
        const eventRef = child(dbRef, `events/${eventId}`);
        await remove(eventRef);

        // Remove the event from all existing units
        const units = await getUnits();
        const updatePromises = units.map(unit => {
            const updatedEvents = unit.events.filter(e => e.name !== eventName);
            return updateUnitEvents(unit.id, updatedEvents);
        });
        await Promise.all(updatePromises);
    } catch (error) {
        console.error("Error deleting event: ", error);
        throw error;
    }
}
