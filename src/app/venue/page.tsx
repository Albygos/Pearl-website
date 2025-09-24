'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Paintbrush, Clock } from 'lucide-react';
import { getVenueDetails } from '@/lib/services/venue';
import { getEvents } from '@/lib/services/events';
import type { VenueDetails, AppEvent } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VenuePage() {
  const [allDetails, setAllDetails] = useState<VenueDetails[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('latest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [venueData, eventData] = await Promise.all([
          getVenueDetails(),
          getEvents(),
        ]);
        setAllDetails(venueData); // Already sorted by timestamp desc
        setEvents(eventData);
      } catch (error) {
        console.error("Failed to fetch venue/event details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayedDetail = selectedEvent === 'latest' 
    ? allDetails[0] 
    : allDetails.find(d => d.item === selectedEvent) || null;

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <section className="text-center mb-12 animate-in w-full max-w-3xl">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-yellow-500">
            Event Venue
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find out what's happening and where. Select an event to find its location.
          </p>
          <div className="mt-6 max-w-md mx-auto">
            <Select onValueChange={setSelectedEvent} value={selectedEvent}>
              <SelectTrigger className="text-base py-6">
                <SelectValue placeholder="Select an event to find its venue..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Show Latest Update</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.name}>{event.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-primary/10 rounded-xl animate-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <CardContent className="space-y-8 text-center p-8">
            {loading ? (
              <>
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-3/4 rounded-md" />
                  <Skeleton className="h-6 w-1/2 rounded-md" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-8 w-3/4 rounded-md" />
                  <Skeleton className="h-6 w-1/2 rounded-md" />
                </div>
              </>
            ) : displayedDetail ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                    <Paintbrush className="text-primary" />
                    Item / Event
                  </h3>
                  <p className="text-4xl font-bold">{displayedDetail.item}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                    <Building className="text-primary" />
                    Room / Hall
                  </h3>
                  <p className="text-4xl font-bold">{displayedDetail.roomNumber}</p>
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 pt-4 border-t">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {new Date(displayedDetail.timestamp).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="py-8">
                <p className="text-muted-foreground text-xl">
                  {selectedEvent === 'latest' ? 'Venue details have not been set yet.' : `No venue set for "${selectedEvent}".`}
                </p>
                <p className="text-md text-muted-foreground mt-2">Please check back later!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
