// Constants for Photo Booth application

import { FilterName, Frame } from '@/lib/types';

export const SCREENS = {
  HOME: 'home' as const,
  BOOTH: 'booth' as const,
  FRAME_SELECTION: 'frameSelection' as const,
  RESULT: 'result' as const,
};

export const FILTERS: { name: string; value: FilterName }[] = [
  { name: 'Original', value: 'none' },
  { name: 'B&W', value: 'bw' },
  { name: 'Warm', value: 'warm' },
  { name: 'Cool', value: 'cool' },
  { name: 'Vintage', value: 'vintage' },
  { name: 'Bold', value: 'bold' },
];

export const FRAMES: Frame[] = [
  { 
    id: 'heart-pink', 
    name: 'Heart Pink', 
    price: 0,
    shape: 'heart',
    borderColor: '#FF69B4',
    borderWidth: 4,
    backgroundColor: '#FFF0F5'
  },
  { 
    id: 'circle-black', 
    name: 'Circle Classic', 
    price: 0,
    shape: 'circle',
    borderColor: '#000000',
    borderWidth: 3,
    backgroundColor: '#FFFFFF'
  },
  { 
    id: 'polaroid-white', 
    name: 'Polaroid White', 
    price: 0,
    shape: 'polaroid',
    borderColor: '#E5E5E5',
    borderWidth: 16,
    backgroundColor: '#FFFFFF'
  },
  { 
    id: 'polaroid-orange', 
    name: 'Polaroid Orange', 
    price: 0,
    shape: 'polaroid',
    borderColor: '#FF8C00',
    borderWidth: 16,
    backgroundColor: '#FFF8F0'
  },
  { 
    id: 'bold-black', 
    name: 'Bold Black', 
    price: 0,
    shape: 'rectangle',
    borderColor: '#000000',
    borderWidth: 6,
    backgroundColor: '#FFFFFF'
  },
  { 
    id: 'dark-elegant', 
    name: 'Dark Elegant', 
    price: 0,
    shape: 'rectangle',
    borderColor: '#2D2D2D',
    borderWidth: 8,
    backgroundColor: '#1A1A1A'
  },
];

export const PHOTO_COUNT = 4;

export const COUNTDOWN_SECONDS = 3;

export const FLASH_DURATION_MS = 150;

export const CAPTURE_DELAY_MS = 700;

export const PRINTING_ANIMATION_MS = 1800;

export const CAMERA_CONSTRAINTS = {
  video: {
    facingMode: 'user',
    width: { ideal: 1280 },
    height: { ideal: 960 },
  },
  audio: false,
} as const;

export const CANVAS_EXPORT_QUALITY = 0.92;

export const DOWNLOAD_IMAGE_CONFIG = {
  cellWidth: 240,
  cellHeight: 240,
  gap: 4,
  padding: 14,
  footerHeight: 40,
} as const;
