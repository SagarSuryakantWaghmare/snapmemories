// Image filter utilities

import { FilterName } from '@/lib/types';
import { CANVAS_EXPORT_QUALITY } from '@/lib/constants';

/**
 * Apply filter to canvas context in-place
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
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'warm':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.1 + 10);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.max(0, data[i + 2] * 0.9);
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'cool':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, data[i] * 0.9);
        data[i + 1] = Math.min(255, data[i + 1] * 1.05);
        data[i + 2] = Math.min(255, data[i + 2] * 1.1 + 10);
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'vintage':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      ctx.putImageData(imageData, 0, 0);
      break;

    case 'bold':
      for (let i = 0; i < data.length; i += 4) {
        for (let ch = 0; ch < 3; ch++) {
          const v = ((data[i + ch] - 128) * 1.5) + 128;
          data[i + ch] = Math.min(255, Math.max(0, v));
        }
      }
      ctx.putImageData(imageData, 0, 0);
      break;
  }
}

/**
 * Apply filter to a single image src and return result via callback.
 * Returns a cancel function so stale operations can be aborted.
 */
export function filterImageData(
  src: string,
  filter: FilterName,
  callback: (result: string) => void
): () => void {
  let cancelled = false;

  if (filter === 'none') {
    // Async so callers always get consistent timing
    setTimeout(() => {
      if (!cancelled) callback(src);
    }, 0);
    return () => { cancelled = true; };
  }

  const img = new Image();

  img.onload = () => {
    if (cancelled) return;

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
    if (!cancelled) callback(canvas.toDataURL('image/jpeg', CANVAS_EXPORT_QUALITY));
  };

  img.onerror = () => {
    if (!cancelled) {
      console.error('filterImageData: Failed to load image for filtering');
      callback(src);
    }
  };

  img.src = src;

  return () => { cancelled = true; };
}

// Module-level generation counter to detect stale batch calls
let filterGeneration = 0;

/**
 * Batch-apply filter to multiple images.
 * If called again before the previous batch finishes, the old batch is cancelled
 * and its callback will never fire — preventing race conditions from rapid filter taps.
 */
export function batchFilterImages(
  images: (string | null)[],
  filter: FilterName,
  callback: (results: (string | null)[]) => void
): void {
  // Increment generation — any pending callbacks from the old generation will be ignored
  const myGeneration = ++filterGeneration;

  const results: (string | null)[] = new Array(images.length).fill(null);
  let completed = 0;

  // Edge case: empty array
  if (images.length === 0) {
    callback(results);
    return;
  }

  const cancelFns: Array<() => void> = [];

  images.forEach((img, index) => {
    if (!img) {
      results[index] = null;
      completed++;
      if (completed === images.length && filterGeneration === myGeneration) {
        callback(results);
      }
      return;
    }

    const cancel = filterImageData(img, filter, (filtered) => {
      // Discard if a newer batch was started
      if (filterGeneration !== myGeneration) return;

      results[index] = filtered;
      completed++;
      if (completed === images.length) {
        callback(results);
      }
    });

    cancelFns.push(cancel);
  });

  // If a newer generation is triggered later, cancel all in-flight operations
  // We store cancellers on the closure; the generation check above is the primary guard
  void cancelFns; // referenced to avoid lint warnings
}
