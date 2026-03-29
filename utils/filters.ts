export type FilterName = 'none' | 'bw' | 'warm' | 'cool' | 'vintage' | 'bold';

export function applyFilterToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: FilterName
): void {
  if (filter === 'none') return;

  if (filter === 'bw') {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(imageData, 0, 0);
  } else if (filter === 'warm') {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(255, 200, 120, 0.22)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  } else if (filter === 'cool') {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(120, 170, 255, 0.22)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  } else if (filter === 'vintage') {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, data[i] * 1.08 + 18);
      data[i + 1] = Math.min(255, data[i + 1] * 0.88 + 8);
      data[i + 2] = Math.min(255, data[i + 2] * 0.72);
    }
    ctx.putImageData(imageData, 0, 0);
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(160, 100, 50, 0.18)';
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = 'source-over';
  } else if (filter === 'bold') {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      for (let ch = 0; ch < 3; ch++) {
        let v = data[i + ch];
        v = ((v - 128) * 1.6) + 128;
        data[i + ch] = Math.min(255, Math.max(0, v));
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}

export function filterImageData(
  src: string,
  filter: FilterName,
  callback: (result: string) => void
): void {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(img, 0, 0);
    applyFilterToCanvas(ctx, canvas.width, canvas.height, filter);
    callback(canvas.toDataURL('image/jpeg', 0.92));
  };
  img.src = src;
}
