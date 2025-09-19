import type { Unit, GalleryImage } from './types';

// This file is now a fallback and can be removed if you fully migrate to a database.
// The data services in /lib/services will be used instead.

export const units: Unit[] = [
  { id: '1', name: 'Chromatic Weavers', score: 95, theme: 'Woven Rainbows', photoAccessCount: 25 },
  { id: '2', name: 'Marble Sculptors Collective', score: 92, theme: 'Stone Dreams', photoAccessCount: 18 },
  { id: '3', name: 'Digital Canvas Crew', score: 88, theme: 'Pixelated Futures', photoAccessCount: 32 },
  { id: '4', name: 'The Abstract Expressionists', score: 85, theme: 'Emotional Landscapes', photoAccessCount: 12 },
  { id: '5', name: 'Street Art Syndicate', score: 82, theme: 'Urban Murals', photoAccessCount: 45 },
  { id: '6', name: 'Kinetic Creations', score: 78, theme: 'Art in Motion', photoAccessCount: 9 },
];

export const galleryImages: GalleryImage[] = [
  { id: 'img1', src: 'https://picsum.photos/seed/1/600/400', alt: 'Colorful abstract painting', aiHint: 'abstract painting' },
  { id: 'img2', src: 'https://picsum.photos/seed/2/600/400', alt: 'A marble statue', unitId: '2', aiHint: 'marble statue' },
  { id: 'img3', src: 'https://picsum.photos/seed/3/600/400', alt: 'Graffiti on a brick wall', unitId: '5', aiHint: 'street art' },
  { id: 'img4', src: 'https://picsum.photos/seed/4/600/400', alt: 'A digital art piece on a large screen', unitId: '3', aiHint: 'digital art' },
  { id: 'img5', src: 'https://picsum.photos/seed/5/600/400', alt: 'A person weaving a colorful tapestry', unitId: '1', aiHint: 'weaving tapestry' },
  { id: 'img6', src: 'https://picsum.photos/seed/6/600/400', alt: 'Close-up of a kinetic sculpture', unitId: '6', aiHint: 'kinetic sculpture' },
  { id: 'img7', src: 'https://picsum.photos/seed/7/600/400', alt: 'An artist painting on a large canvas', unitId: '4', aiHint: 'artist painting' },
  { id: 'img8', src: 'https://picsum.photos/seed/8/600/400', alt: 'Detailed shot of a woven fabric', unitId: '1', aiHint: 'woven fabric' },
  { id: 'img9', src: 'https://picsum.photos/seed/9/600/400', alt: 'Another angle of the marble statue', unitId: '2', aiHint: 'statue detail' },
  { id: 'img10', src: 'https://picsum.photos/seed/10/600/400', alt: 'Abstract digital creation', unitId: '3', aiHint: 'abstract digital' },
  { id: 'img11', src: 'https://picsum.photos/seed/11/600/400', alt: 'Crowd watching a street artist', unitId: '5', aiHint: 'crowd watching' },
  { id: 'img12', src: 'https://picsum.photos/seed/12/600/400', alt: 'Colorful light installation', aiHint: 'light installation' },
];
