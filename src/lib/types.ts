export type EventScore = {
  name: string;
  score: number;
}

export type Unit = {
  id: string;
  name: string;
  events: EventScore[];
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
