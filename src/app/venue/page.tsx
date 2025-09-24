'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Building, Paintbrush, Clock } from 'lucide-react';
import { getLatestVenueDetails } from '@/lib/services/venue';
import type { VenueDetails } from '@/lib/types';
import { database } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

export default function VenuePage() {
  const [details, setDetails] = useState<VenueDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Use getLatestVenueDetails which handles the sorting and gets the most recent one.
    const venueRef = ref(database, 'venue');
    const unsubscribe = onValue(venueRef, async () => {
      try {
        const latestDetails = await getLatestVenueDetails();
        setDetails(latestDetails);
      } catch (error) {
        console.error("Failed to fetch latest venue details:", error);
        setDetails(null);
      } finally {
        setLoading(false);
      }
    });

    // Initial fetch
    getLatestVenueDetails().then(latestDetails => {
      setDetails(latestDetails);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-background min-h-full">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <section className="text-center mb-12 animate-in">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-headline font-extrabold mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-500 to-yellow-500">
            Event Venue
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find out what's happening and where, live.
          </p>
        </section>

        <Card className="w-full max-w-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-primary/10 rounded-xl animate-in" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
          <CardHeader>
            <CardTitle className="text-3xl font-headline text-center">Current Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 text-center p-6">
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
            ) : details ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                    <Building className="text-primary" />
                    Room / Hall
                  </h3>
                  <p className="text-4xl font-bold">{details.roomNumber}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground flex items-center justify-center gap-2">
                    <Paintbrush className="text-primary" />
                    Item / Event
                  </h3>
                  <p className="text-4xl font-bold">{details.item}</p>
                </div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-2 pt-4 border-t">
                    <Clock className="h-4 w-4" />
                    <span>Last updated: {new Date(details.timestamp).toLocaleString()}</span>
                </div>
              </>
            ) : (
              <div className="py-8">
                <p className="text-muted-foreground text-xl">Venue details have not been set yet.</p>
                <p className="text-md text-muted-foreground mt-2">Please check back later!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
