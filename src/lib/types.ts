export type EventScore = {
  name: string;
  score: number;
}

export type Unit = {
  id: string;
  name: string;
  events: EventScore[];
  photoAccessCount: number;
  credentialId: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  alt: string;
  unitId?: string;
  aiHint: string;
  storagePath: string;
};

export type AppEvent = {
  id: string;
  name: string;
};
