'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getGalleryImages } from '@/lib/services/gallery';
import type { GalleryImage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function GalleryPage() {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoadImages() {
      const loggedInUnitId = localStorage.getItem('artfestlive_unit_id');
      if (!loggedInUnitId) {
        router.push('/login');
        return;
      }
      
      setLoading(true);
      try {
        const images = await getGalleryImages();
        // Show newest images first
        setGalleryImages(images.reverse());
      } catch (error) {
        console.error("Failed to load gallery images:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAuthAndLoadImages();
  }, [router]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
             <Card key={i} className="rounded-lg overflow-hidden">
               <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] w-full" />
                </CardContent>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-accent/50">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Event Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A visual journey through the highlights of ArtFestLive.
          </p>
        </div>

        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {galleryImages.map((image) => (
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
          <div className="text-center py-24 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground text-xl">The gallery is currently empty.</p>
            <p className="text-md text-muted-foreground mt-2">Check back soon for amazing art!</p>
          </div>
        )}
      </div>
    </div>
  );
}
