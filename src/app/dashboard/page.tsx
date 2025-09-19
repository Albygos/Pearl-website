'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getUnit, incrementUnitPhotoAccessCount } from '@/lib/services/units';
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
      try {
        const [fetchedUnit, allImages] = await Promise.all([
          getUnit(loggedInUnitId),
          getGalleryImages()
        ]);

        if (fetchedUnit) {
          setUnit(fetchedUnit);
          const imagesForUnit = allImages.filter(img => img.unitId === fetchedUnit.id).reverse();
          setUnitImages(imagesForUnit);
          if (imagesForUnit.length > 0) {
            incrementUnitPhotoAccessCount(loggedInUnitId);
          }
        } else {
          handleSignOut();
        }
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        handleSignOut();
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);
  
  const handleSignOut = () => {
    localStorage.removeItem('artfestlive_unit_id');
    router.push('/login');
  };

  if (loading) {
    return (
       <div className="bg-accent/50">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center text-center sm:text-left mb-12 gap-4">
              <div>
                <Skeleton className="h-10 w-64 mx-auto sm:mx-0 mb-4" />
                <Skeleton className="h-6 w-80 mx-auto sm:mx-0" />
              </div>
              <Skeleton className="h-10 w-24 mx-auto sm:mx-0" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="rounded-xl overflow-hidden">
                <CardContent className="p-0">
                    <Skeleton className="aspect-[4/3] w-full" />
                  </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!unit) {
    return null;
  }

  return (
    <div className="bg-accent/50 min-h-full">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {unitImages.map((image) => (
               <Card key={image.id} className="overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300 border-none rounded-xl">
                <CardContent className="p-0">
                  <div className="aspect-w-4 aspect-h-3">
                     <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      data-ai-hint={image.aiHint}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-2 border-dashed rounded-lg mt-16">
            <p className="text-muted-foreground text-xl">No photos have been assigned to your unit yet.</p>
            <p className="text-md text-muted-foreground mt-2">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
