// Canvas utilities for image composition and download

import { DOWNLOAD_IMAGE_CONFIG, CANVAS_EXPORT_QUALITY } from '@/lib/constants';

/**
 * Create composite image from 4 photos in vertical strip
 */
export function downloadCompositeImage(images: (string | null)[]): void {
  const { cellWidth, cellHeight, gap, padding, footerHeight } = DOWNLOAD_IMAGE_CONFIG;
  
  const totalWidth = cellWidth + padding * 2;
  const totalHeight = cellHeight * 4 + gap * 3 + padding * 2 + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // White background
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Black border around photos
  ctx.fillStyle = '#111111';
  ctx.fillRect(
    padding - 2,
    padding - 2,
    cellWidth + 4,
    cellHeight * 4 + gap * 3 + 4
  );

  let loadedCount = 0;
  const totalImages = images.filter((img) => img !== null).length;

  if (totalImages === 0) {
    addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
    return;
  }

  // Load and draw images in vertical strip
  images.forEach((imageSrc, index) => {
    if (!imageSrc) {
      loadedCount++;
      if (loadedCount === totalImages) {
        addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const x = padding;
      const y = padding + index * (cellHeight + gap);
      
      ctx.drawImage(img, x, y, cellWidth, cellHeight);
      
      loadedCount++;
      if (loadedCount === totalImages) {
        addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to load image ${index}`);
      loadedCount++;
      if (loadedCount === totalImages) {
        addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
      }
    };
    
    img.src = imageSrc;
  });
}

/**
 * Add footer text and trigger download
 */
function addFooterAndDownload(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  totalWidth: number,
  totalHeight: number
): void {
  // Add footer text
  ctx.fillStyle = '#999999';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  ctx.fillText(`Photo Booth - ${dateStr}`, totalWidth / 2, totalHeight - 8);

  // Trigger download
  const link = document.createElement('a');
  link.download = `photo-booth-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', CANVAS_EXPORT_QUALITY);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
