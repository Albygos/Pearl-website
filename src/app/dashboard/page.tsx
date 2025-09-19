import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { galleryImages, units } from '@/lib/mock-data';

export default function DashboardPage() {
  // Mocking a logged-in user (Unit: Chromatic Weavers)
  const loggedInUnit = units[0];
  const unitImages = galleryImages.filter(img => img.unitId === loggedInUnit.id);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4">
          Welcome, {loggedInUnit.name}!
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Here are the photos captured of your amazing work during the event.
        </p>
      </div>

      {unitImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="text-center py-16">
          <p className="text-muted-foreground">No photos available for your unit yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
