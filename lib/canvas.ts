// Canvas utilities for image composition and download

import { DOWNLOAD_IMAGE_CONFIG, CANVAS_EXPORT_QUALITY } from '@/lib/constants';
import { PhotoStripTemplate } from '@/lib/templates';
import { Frame } from '@/lib/types';

/**
 * Create composite image from 4 photos in vertical strip with template and frame styling
 */
export function downloadCompositeImage(
  images: (string | null)[], 
  template?: PhotoStripTemplate,
  frame?: Frame
): void {
  const { cellWidth, cellHeight, gap, padding, footerHeight, renderScale } = DOWNLOAD_IMAGE_CONFIG;
  
  // Always include footer for branding
  const textAreaHeight = footerHeight;
  const totalWidth = cellWidth + padding * 2;
  const totalHeight = cellHeight * 4 + gap * 3 + padding * 2 + textAreaHeight;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(totalWidth * renderScale);
  canvas.height = Math.round(totalHeight * renderScale);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Failed to get canvas context');
    return;
  }

  ctx.scale(renderScale, renderScale);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Apply background - prefer frame background if available, otherwise use template
  if (frame) {
    ctx.fillStyle = frame.backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);
  } else if (template) {
    applyTemplateBackground(ctx, totalWidth, totalHeight, template);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, totalWidth, totalHeight);
  }

  Promise.all(images.map((imageSrc, index) => loadImageForCanvas(imageSrc, index))).then((loadedImages) => {
    loadedImages.forEach((img, index) => {
      if (!img) {
        return;
      }

      const x = padding;
      const y = padding + index * (cellHeight + gap);
      drawPhotoCell(ctx, img, x, y, cellWidth, cellHeight, template, frame);
    });

    addTemplateDecorationsAndDownload(canvas, ctx, totalWidth, totalHeight, template, frame);
  });
}

/**
 * Apply template background
 */
function applyTemplateBackground(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  const bg = template.colors.background;
  
  if (bg.startsWith('linear-gradient')) {
    const match = bg.match(/#[0-9a-fA-F]{6}/g);
    if (match && match.length >= 2) {
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, match[0]);
      gradient.addColorStop(1, match[1]);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = template.colors.secondary;
    }
  } else {
    ctx.fillStyle = bg;
  }
  
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
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
 * Apply frame border
 */
function applyFrameBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: Frame
): void {
  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = frame.borderWidth;
  const halfLine = frame.borderWidth / 2;
  ctx.strokeRect(x + halfLine, y + halfLine, width - frame.borderWidth, height - frame.borderWidth);
}

function loadImageForCanvas(imageSrc: string | null, index: number): Promise<HTMLImageElement | null> {
  if (!imageSrc) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.error(`Failed to load image ${index}`);
      resolve(null);
    };
    img.src = imageSrc;
  });
}

function drawPhotoCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  template?: PhotoStripTemplate,
  frame?: Frame
): void {
  if (!frame) {
    drawImageCover(ctx, image, x, y, width, height);
    if (template) {
      applyTemplateBorder(ctx, x, y, width, height, template);
    }
    return;
  }

  switch (frame.shape) {
    case 'circle':
      drawShapedFrameCell(ctx, image, x, y, width, height, frame, 'circle');
      break;
    case 'heart':
      drawShapedFrameCell(ctx, image, x, y, width, height, frame, 'heart');
      break;
    case 'polaroid':
      drawPolaroidFrameCell(ctx, image, x, y, width, height, frame);
      break;
    default:
      drawRectangleFrameCell(ctx, image, x, y, width, height, frame);
      break;
  }
}

function drawRectangleFrameCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: Frame
): void {
  ctx.fillStyle = frame.backgroundColor;
  ctx.fillRect(x, y, width, height);
  drawImageCover(ctx, image, x, y, width, height);
  applyFrameBorder(ctx, x, y, width, height, frame);
}

function drawShapedFrameCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: Frame,
  shape: 'circle' | 'heart'
): void {
  const inset = Math.max(2, frame.borderWidth + 1);
  const photoX = x + inset;
  const photoY = y + inset;
  const photoWidth = width - inset * 2;
  const photoHeight = height - inset * 2;

  if (photoWidth <= 0 || photoHeight <= 0) {
    return;
  }

  ctx.fillStyle = frame.backgroundColor;
  ctx.fillRect(x, y, width, height);

  ctx.save();
  beginShapePath(ctx, shape, photoX, photoY, photoWidth, photoHeight);
  ctx.clip();
  drawImageCover(ctx, image, photoX, photoY, photoWidth, photoHeight);
  ctx.restore();

  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = frame.borderWidth;
  beginShapePath(ctx, shape, photoX, photoY, photoWidth, photoHeight);
  ctx.stroke();
}

function drawPolaroidFrameCell(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  frame: Frame
): void {
  const inset = Math.max(8, Math.min(Math.round(frame.borderWidth), 24));
  const bottomInset = Math.round(inset * 1.8);
  const photoX = x + inset;
  const photoY = y + inset;
  const photoWidth = width - inset * 2;
  const photoHeight = height - inset - bottomInset;

  if (photoWidth <= 0 || photoHeight <= 0) {
    return;
  }

  ctx.fillStyle = frame.backgroundColor;
  ctx.fillRect(x, y, width, height);

  ctx.strokeStyle = frame.borderColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, width - 1, height - 1);

  drawImageCover(ctx, image, photoX, photoY, photoWidth, photoHeight);
  ctx.strokeRect(photoX + 0.5, photoY + 0.5, photoWidth - 1, photoHeight - 1);
}

function beginShapePath(
  ctx: CanvasRenderingContext2D,
  shape: 'circle' | 'heart',
  x: number,
  y: number,
  width: number,
  height: number
): void {
  ctx.beginPath();

  if (shape === 'circle') {
    const radius = Math.min(width, height) / 2;
    ctx.arc(x + width / 2, y + height / 2, radius, 0, Math.PI * 2);
    ctx.closePath();
    return;
  }

  const point = (nx: number, ny: number) => ({
    x: x + (nx / 100) * width,
    y: y + (ny / 100) * height,
  });

  const p1 = point(50, 88);
  const p2 = point(25, 65);
  const p3 = point(5, 50);
  const p4 = point(5, 30);
  const p5 = point(5, 15);
  const p6 = point(20, 5);
  const p7 = point(35, 5);
  const p8 = point(45, 5);
  const p9 = point(50, 15);
  const p10 = point(55, 5);
  const p11 = point(65, 5);
  const p12 = point(80, 5);
  const p13 = point(95, 15);
  const p14 = point(95, 30);
  const p15 = point(95, 50);
  const p16 = point(75, 65);
  const p17 = point(50, 88);

  ctx.moveTo(p1.x, p1.y);
  ctx.bezierCurveTo(p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
  ctx.bezierCurveTo(p5.x, p5.y, p6.x, p6.y, p7.x, p7.y);
  ctx.bezierCurveTo(p8.x, p8.y, p9.x, p9.y, p9.x, p9.y);
  ctx.bezierCurveTo(p9.x, p9.y, p10.x, p10.y, p11.x, p11.y);
  ctx.bezierCurveTo(p12.x, p12.y, p13.x, p13.y, p14.x, p14.y);
  ctx.bezierCurveTo(p15.x, p15.y, p16.x, p16.y, p17.x, p17.y);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  destX: number,
  destY: number,
  destWidth: number,
  destHeight: number
): void {
  if (destWidth <= 0 || destHeight <= 0) {
    return;
  }

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) {
    return;
  }

  const sourceRatio = sourceWidth / sourceHeight;
  const destRatio = destWidth / destHeight;
  let cropWidth = sourceWidth;
  let cropHeight = sourceHeight;
  let cropX = 0;
  let cropY = 0;

  if (sourceRatio > destRatio) {
    cropWidth = sourceHeight * destRatio;
    cropX = (sourceWidth - cropWidth) / 2;
  } else {
    cropHeight = sourceWidth / destRatio;
    cropY = (sourceHeight - cropHeight) / 2;
  }

  ctx.drawImage(
    image,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    destX,
    destY,
    destWidth,
    destHeight
  );
}

/**
 * Add decorations, footer and download
 */
function addTemplateDecorationsAndDownload(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  totalWidth: number,
  totalHeight: number,
  template?: PhotoStripTemplate,
  frame?: Frame
): void {
  const { footerHeight } = DOWNLOAD_IMAGE_CONFIG;
  
  // Apply decorations from template
  if (template) {
    applyDecorations(ctx, totalWidth, totalHeight, template);
  }
  
  // Add footer text - use frame colors if available, otherwise template, otherwise defaults
  const textY = totalHeight - footerHeight;
  const textColor = frame?.borderColor || template?.textArea.color || '#666666';
  const fontFamily = template?.textArea.font || 'Arial, sans-serif';
  
  ctx.textAlign = 'center';
  
  // Date
  ctx.fillStyle = textColor;
  ctx.font = `14px ${fontFamily}`;
  const date = new Date().toLocaleDateString();
  ctx.fillText(date, totalWidth / 2, textY + footerHeight / 2 - 6);
  
  // Branding - snapmemories by sagar
  ctx.font = `10px ${fontFamily}`;
  // Make branding slightly transparent
  const brandingColor = textColor.length === 7 ? textColor + 'AA' : textColor;
  ctx.fillStyle = brandingColor;
  ctx.fillText('snapmemories by sagar', totalWidth / 2, textY + footerHeight / 2 + 10);

  // Download
  const link = document.createElement('a');
  link.download = `snapmemories-${Date.now()}.jpg`;
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
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  switch (template.decorations.type) {
    case 'confetti':
      drawConfetti(ctx, canvasWidth, canvasHeight, template);
      break;
    case 'hearts':
      drawHearts(ctx, canvasWidth, canvasHeight, template);
      break;
    case 'film':
      drawFilmPerforations(ctx, canvasWidth, canvasHeight, template);
      break;
    case 'neon':
      drawNeonScanlines(ctx, canvasWidth, canvasHeight, template);
      break;
    case 'polaroid':
      drawPolaroidShadow(ctx, canvasWidth, canvasHeight);
      break;
  }
}

// Decoration functions
function drawConfetti(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  const count = Math.floor(40 * template.decorations.intensity);
  const colors = [template.colors.primary, template.colors.secondary, template.colors.accent];
  
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvasWidth;
    const y = Math.random() * canvasHeight;
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

function drawHearts(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  const count = Math.floor(12 * template.decorations.intensity);
  
  for (let i = 0; i < count; i++) {
    const x = 10 + Math.random() * (canvasWidth - 20);
    const y = 10 + Math.random() * (canvasHeight - 20);
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

function drawFilmPerforations(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  const perfWidth = 6;
  const perfHeight = 12;
  const spacing = 16;
  
  ctx.fillStyle = template.colors.accent;
  
  for (let i = 0; i < canvasHeight; i += spacing) {
    ctx.fillRect(4, i, perfWidth, perfHeight);
    ctx.fillRect(canvasWidth - 4 - perfWidth, i, perfWidth, perfHeight);
  }
}

function drawNeonScanlines(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  template: PhotoStripTemplate
): void {
  ctx.strokeStyle = template.colors.primary + '15';
  ctx.lineWidth = 1;
  
  for (let i = 0; i < canvasHeight; i += 3) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(canvasWidth, i);
    ctx.stroke();
  }
}

function drawPolaroidShadow(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 3;
  ctx.shadowOffsetY = 3;
  
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, canvasWidth - 10, canvasHeight - 10);
  
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
