export interface CaptureOptions {
  isBW?: boolean;
}

export function captureVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: CaptureOptions = {}
): string | null {
  if (!video || !video.videoWidth) {
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Mirror the video (flip horizontally)
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, 0, 0);
  ctx.restore();

  // Apply B&W if needed
  if (options.isBW) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}

export function downloadCompositeImage(images: (string | null)[]): void {
  const cellWidth = 240;
  const cellHeight = 240;
  const gap = 4;
  const padding = 14;
  const totalWidth = cellWidth + padding * 2;
  const totalHeight = cellHeight * 4 + gap * 3 + padding * 2 + 24;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Black background
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Load and draw images (1x4 vertical strip)
  let loaded = 0;
  const positions = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ];

  positions.forEach(([col, row], i) => {
    if (!images[i]) {
      loaded++;
      if (loaded === 4) {
        addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
      }
      return;
    }

    const img = new Image();
    img.onload = () => {
      const x = padding + col * (cellWidth + gap);
      const y = padding + row * (cellHeight + gap);
      ctx.drawImage(img, x, y, cellWidth, cellHeight);
      loaded++;
      if (loaded === 4) {
        addFooterAndDownload(canvas, ctx, totalWidth, totalHeight);
      }
    };
    img.src = images[i]!;
  });
}

function addFooterAndDownload(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  totalWidth: number,
  totalHeight: number
): void {
  // Add footer text
  ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('© 2025 Snap Memories · snapmemories.app', totalWidth / 2, totalHeight - 8);

  // Trigger download
  const link = document.createElement('a');
  link.download = `snap-memories-${Date.now()}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', 0.92);
  link.click();
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
