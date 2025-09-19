'use client'

import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader } from 'lucide-react';
import { getUnits } from '@/lib/services/units';
import { getGalleryImages, addGalleryImage } from '@/lib/services/gallery';
import type { Unit, GalleryImage } from '@/lib/types';

export default function ManageGalleryPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [aiHint, setAiHint] = useState('');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [fetchedUnits, fetchedImages] = await Promise.all([
        getUnits(),
        getGalleryImages()
      ]);
      setUnits(fetchedUnits);
      setGalleryImages(fetchedImages.reverse());
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Prefill alt text with filename without extension
      setAltText(file.name.split('.').slice(0, -1).join('.').replace(/[-_]/g, ' '));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
  };

  const resetForm = () => {
      setSelectedFile(null);
      setPreviewUrl(null);
      setAltText('');
      setAiHint('');
      setSelectedUnitId(null);
      const fileInput = document.getElementById('picture') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
  }

  const handleUpload = async () => {
    if (!selectedFile || !altText) {
        toast({
            title: 'Missing Information',
            description: 'Please select a file and provide alt text.',
            variant: 'destructive'
        });
        return;
    }

    setUploading(true);
    try {
        const base64String = await fileToBase64(selectedFile);
        const newImage: Omit<GalleryImage, 'id'> = {
            src: base64String,
            alt: altText,
            aiHint: aiHint,
            unitId: selectedUnitId || undefined
        }
        
        const newImageId = await addGalleryImage(newImage);
        setGalleryImages([{ id: newImageId, ...newImage }, ...galleryImages]);

        toast({
            title: 'Upload Successful',
            description: 'The new image has been added to the gallery.'
        });
        resetForm();

    } catch (error) {
        console.error(error);
        toast({
            title: 'Upload Failed',
            description: 'There was an error uploading the image.',
            variant: 'destructive'
        });
    } finally {
        setUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">Manage Gallery</h1>
        <p className="text-muted-foreground">Upload new photos for the event gallery.</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Image</CardTitle>
              <CardDescription>Select an image and provide details.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              {previewUrl && (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )}
               <div className="grid gap-2">
                <Label htmlFor="alt-text">Alt Text (Description)</Label>
                <Textarea id="alt-text" placeholder="A detailed description of the image" value={altText} onChange={(e) => setAltText(e.target.value)} />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="ai-hint">AI Hint</Label>
                <Input id="ai-hint" placeholder="e.g. 'abstract painting'" value={aiHint} onChange={(e) => setAiHint(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="unit-select">Assign to Unit (Optional)</Label>
                <Select onValueChange={setSelectedUnitId} value={selectedUnitId || undefined}>
                    <SelectTrigger id="unit-select">
                        <SelectValue placeholder="Select a unit" />
                    </SelectTrigger>
                    <SelectContent>
                        {units.map(unit => (
                            <SelectItem key={unit.id} value={unit.id}>{unit.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleUpload} disabled={uploading}>
                    {uploading ? <Loader className="mr-2 animate-spin" /> : <Upload className="mr-2"/>}
                    Upload Image
                </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="lg:col-span-2">
           <h2 className="text-2xl font-headline font-bold mb-4">Current Gallery</h2>
           {loading ? (
             <p>Loading images...</p>
           ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {galleryImages.map(image => (
                    <Card key={image.id} className="overflow-hidden">
                        <CardContent className="p-0">
                           <div className="aspect-video relative">
                             <Image src={image.src} alt={image.alt} fill className="object-cover" />
                           </div>
                        </CardContent>
                        <CardFooter className="p-3 bg-muted/50 text-xs text-muted-foreground flex-col items-start">
                           <p className="font-semibold truncate text-foreground">{image.alt}</p>
                           {image.unitId && <p>Unit: {units.find(u => u.id === image.unitId)?.name || 'N/A'}</p>}
                        </CardFooter>
                    </Card>
                ))}
            </div>
           )}
           {!loading && galleryImages.length === 0 && <p className="text-muted-foreground mt-4">No images in the gallery yet.</p>}
        </div>
      </div>
    </div>
  );
}
