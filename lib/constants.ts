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
  { id: 'classic', name: 'Classic', price: 0 },
  { id: 'modern', name: 'Modern', price: 0 },
  { id: 'vintage', name: 'Vintage', price: 0 },
  { id: 'polaroid', name: 'Polaroid', price: 0 },
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
  footerHeight: 24,
} as const;
