// Image filter utilities

import { FilterName } from '@/lib/types';
import { CANVAS_EXPORT_QUALITY } from '@/lib/constants';

/**
 * Apply filter to canvas context
 */
export function applyFilterToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: FilterName
): void {
  if (filter === 'none') return;

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  switch (filter) {
    case 'bw':
      // Grayscale conversion
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'warm':
      // Warm tone overlay
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1 + 10);     // More red
        data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slightly more green
        data[i + 2] = Math.max(0, data[i + 2] * 0.9);    // Less blue
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'cool':
      // Cool tone overlay
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] * 0.9);            // Less red
        data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Slightly more green
        data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10); // More blue
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'vintage':
      // Vintage/sepia effect
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'bold':
      // High contrast
      for (let i = 0; i < data.length; i += 4) {
        for (let ch = 0; ch < 3; ch++) {
          let value = data[i + ch];
          // Increase contrast
          value = ((value - 128) * 1.5) + 128;
          data[i + ch] = Math.min(255, Math.max(0, value));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      break;
  }
}

/**
 * Apply filter to image and return result as data URL
 */
export function filterImageData(
  src: string,
  filter: FilterName,
  callback: (result: string) => void
): void {
  if (filter === 'none') {
    callback(src);
    return;
  }

  const img = new Image();
  
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      callback(src);
      return;
    }

    ctx.drawImage(img, 0, 0);
    applyFilterToCanvas(ctx, canvas.width, canvas.height, filter);
    
    callback(canvas.toDataURL('image/jpeg', CANVAS_EXPORT_QUALITY));
  };

  img.onerror = () => {
    console.error('Failed to load image for filtering');
    callback(src);
  };

  img.src = src;
}

/**
 * Batch apply filter to multiple images
 */
export function batchFilterImages(
  images: (string | null)[],
  filter: FilterName,
  callback: (results: (string | null)[]) => void
): void {
  if (filter === 'none') {
    callback(images);
    return;
  }

  const results: (string | null)[] = new Array(images.length).fill(null);
  let completed = 0;

  images.forEach((img, index) => {
    if (!img) {
      results[index] = null;
      completed++;
      if (completed === images.length) {
        callback(results);
      }
      return;
    }

    filterImageData(img, filter, (filtered) => {
      results[index] = filtered;
      completed++;
      if (completed === images.length) {
        callback(results);
      }
    });
  });
}
