import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { getGalleryImages } from '@/lib/services/gallery';
import { unstable_noStore as noStore } from 'next/cache';


export default async function GalleryPage() {
  noStore();
  const galleryImages = await getGalleryImages();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">Event Gallery</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          A visual journey through the highlights of ArtFestLive.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {galleryImages.map((image) => (
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
    </div>
  );
}
