'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getUnit } from '@/lib/services/units';
import { getGalleryImages } from '@/lib/services/gallery';
import { Skeleton } from '@/components/ui/skeleton';
import type { Unit, GalleryImage } from '@/lib/types';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const [unit, setUnit] = useState<Unit | null>(null);
  const [unitImages, setUnitImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadDashboard() {
      const loggedInUnitId = localStorage.getItem('artfestlive_unit_id');
      if (!loggedInUnitId) {
        router.push('/login');
        return;
      }

      setLoading(true);
      const [fetchedUnit, allImages] = await Promise.all([
        getUnit(loggedInUnitId),
        getGalleryImages()
      ]);

      if (fetchedUnit) {
        setUnit(fetchedUnit);
        setUnitImages(allImages.filter(img => img.unitId === fetchedUnit.id));
      } else {
        // If unit not found, clear storage and redirect
        localStorage.removeItem('artfestlive_unit_id');
        router.push('/login');
        return;
      }
      setLoading(false);
    }

    loadDashboard();
  }, [router]);
  
  const handleSignOut = () => {
    localStorage.removeItem('artfestlive_unit_id');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
             <Card key={i}><CardContent className="p-0"><Skeleton className="aspect-[3/2] w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!unit) {
    return null; // or a message indicating no unit data
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-center sm:text-left mb-12 gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-headline font-bold mb-2">
            Welcome, {unit.name}!
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto sm:mx-0">
            Here are the photos captured of your amazing work.
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
      </div>

      {unitImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {unitImages.map((image) => (
            <Card key={image.id} className="overflow-hidden group shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="aspect-w-3 aspect-h-2">
                   <Image
                    src={image.src}
                    alt={image.alt}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    data-ai-hint={image.aiHint}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg">No photos available for your unit yet.</p>
          <p className="text-sm text-muted-foreground mt-2">Check back soon!</p>
        </div>
      )}
    </div>
  );
}
