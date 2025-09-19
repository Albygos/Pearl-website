export type Unit = {
  id: string;
  name: string;
  score: number;
  theme: string;
  photoAccessCount: number;
  credentialId: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  unitId?: string;
  aiHint: string;
};
