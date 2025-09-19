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
             <div key={i} className="aspect-w-1 aspect-h-1">
                <Skeleton className="w-full h-full rounded-lg" />
             </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
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
              <div key={image.id} className="group relative aspect-w-1 aspect-h-1 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                  data-ai-hint={image.aiHint}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.alt}</p>
                </div>
              </div>
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
