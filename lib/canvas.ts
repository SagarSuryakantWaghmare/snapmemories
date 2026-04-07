// Canvas utilities for image composition and download

import { DOWNLOAD_IMAGE_CONFIG, CANVAS_EXPORT_QUALITY } from '@/lib/constants';
import { PhotoStripTemplate } from '@/lib/templates';

/**
 * Create composite image from 4 photos in vertical strip with template styling
 */
export function downloadCompositeImage(images: (string | null)[], template?: PhotoStripTemplate): void {
  const { cellWidth, cellHeight, gap, padding, footerHeight } = DOWNLOAD_IMAGE_CONFIG;
  
  const textAreaHeight = template?.textArea.enabled ? footerHeight : 0;
  const totalWidth = cellWidth + padding * 2;
  const totalHeight = cellHeight * 4 + gap * 3 + padding * 2 + textAreaHeight;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  // Apply template background
  if (template) {
    applyTemplateBackground(ctx, canvas, template);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
  }

  let loadedCount = 0;
  const totalImages = images.filter((img) => img !== null).length;

  if (totalImages === 0) {
    addTemplateDecorationsAndDownload(canvas, ctx, totalWidth, totalHeight, template);
    return;
  }

  // Load and draw images in vertical strip
  images.forEach((imageSrc, index) => {
    if (!imageSrc) {
      loadedCount++;
      if (loadedCount === totalImages) {
        addTemplateDecorationsAndDownload(canvas, ctx, totalWidth, totalHeight, template);
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const x = padding;
      const y = padding + index * (cellHeight + gap);
      
      ctx.drawImage(img, x, y, cellWidth, cellHeight);
      
      // Apply template border
      if (template) {
        applyTemplateBorder(ctx, x, y, cellWidth, cellHeight, template);
      }
      
      loadedCount++;
      if (loadedCount === totalImages) {
        addTemplateDecorationsAndDownload(canvas, ctx, totalWidth, totalHeight, template);
      }
    };
    
    img.onerror = () => {
      console.error(`Failed to load image ${index}`);
      loadedCount++;
      if (loadedCount === totalImages) {
        addTemplateDecorationsAndDownload(canvas, ctx, totalWidth, totalHeight, template);
      }
    };
    
    img.src = imageSrc;
  });
}

/**
 * Apply template background
 */
function applyTemplateBackground(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  template: PhotoStripTemplate
): void {
  const bg = template.colors.background;
  
  if (bg.startsWith('linear-gradient')) {
    const match = bg.match(/#[0-9a-fA-F]{6}/g);
    if (match && match.length >= 2) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, match[0]);
      gradient.addColorStop(1, match[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = template.colors.secondary;
    }
  } else {
    ctx.fillStyle = bg;
  }
  
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Apply template border
 */
function applyTemplateBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  template: PhotoStripTemplate
): void {
  ctx.strokeStyle = template.borderStyle.color;
  ctx.lineWidth = template.borderStyle.width;
  
  if (template.borderStyle.pattern === 'glow') {
    ctx.shadowColor = template.colors.primary;
    ctx.shadowBlur = 15;
  }
  
  ctx.strokeRect(x, y, width, height);
  ctx.shadowBlur = 0;
}

/**
 * Add decorations, footer and download
 */
function addTemplateDecorationsAndDownload(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  totalWidth: number,
  totalHeight: number,
  template?: PhotoStripTemplate
): void {
  const { footerHeight } = DOWNLOAD_IMAGE_CONFIG;
  
  // Apply decorations
  if (template) {
    applyDecorations(ctx, canvas, template);
    
    // Add text area
    if (template.textArea.enabled) {
      const textY = totalHeight - footerHeight;
      ctx.fillStyle = template.textArea.color;
      ctx.font = `14px ${template.textArea.font}`;
      ctx.textAlign = 'center';
      const date = new Date().toLocaleDateString();
      ctx.fillText(date, totalWidth / 2, textY + footerHeight / 2);
    }
  } else {
    // Default footer
    ctx.fillStyle = '#999999';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    const dateStr = new Date().toLocaleDateString();
    ctx.fillText(`Photo Booth - ${dateStr}`, totalWidth / 2, totalHeight - 8);
  }

  // Download
  const link = document.createElement('a');
  link.download = `photo-booth-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', CANVAS_EXPORT_QUALITY);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Apply template decorations
 */
function applyDecorations(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  template: PhotoStripTemplate
): void {
  switch (template.decorations.type) {
    case 'confetti':
      drawConfetti(ctx, canvas, template);
      break;
    case 'hearts':
      drawHearts(ctx, canvas, template);
      break;
    case 'film':
      drawFilmPerforations(ctx, canvas, template);
      break;
    case 'neon':
      drawNeonScanlines(ctx, canvas, template);
      break;
    case 'polaroid':
      drawPolaroidShadow(ctx, canvas);
      break;
  }
}

// Decoration functions
function drawConfetti(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: PhotoStripTemplate): void {
  const count = Math.floor(40 * template.decorations.intensity);
  const colors = [template.colors.primary, template.colors.secondary, template.colors.accent];
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = 4 + Math.random() * 6;
    const rotation = Math.random() * Math.PI;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = color;
    ctx.fillRect(-size / 2, -size / 2, size, size * 2);
    ctx.restore();
  }
}

function drawHearts(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: PhotoStripTemplate): void {
  const count = Math.floor(12 * template.decorations.intensity);
  
  for (let i = 0; i < count; i++) {
    const x = 10 + Math.random() * (canvas.width - 20);
    const y = 10 + Math.random() * (canvas.height - 20);
    const size = 10 + Math.random() * 15;
    
    ctx.fillStyle = template.colors.accent + '60';
    drawHeart(ctx, x, y, size);
  }
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, size / 4);
  ctx.bezierCurveTo(-size / 2, -size / 4, -size, size / 4, 0, size);
  ctx.bezierCurveTo(size, size / 4, size / 2, -size / 4, 0, size / 4);
  ctx.fill();
  ctx.restore();
}

function drawFilmPerforations(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: PhotoStripTemplate): void {
  const perfWidth = 6;
  const perfHeight = 12;
  const spacing = 16;
  
  ctx.fillStyle = template.colors.accent;
  
  for (let i = 0; i < canvas.height; i += spacing) {
    ctx.fillRect(4, i, perfWidth, perfHeight);
    ctx.fillRect(canvas.width - 4 - perfWidth, i, perfWidth, perfHeight);
  }
}

function drawNeonScanlines(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, template: PhotoStripTemplate): void {
  ctx.strokeStyle = template.colors.primary + '15';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < canvas.height; i += 3) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvas.width, i);
    ctx.stroke();
  }
}

function drawPolaroidShadow(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/**
 * Delay utility for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
