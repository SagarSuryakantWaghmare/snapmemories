// Camera utilities for video capture and stream management

import { CaptureOptions } from '@/lib/types';
import { CAMERA_CONSTRAINTS, CANVAS_EXPORT_QUALITY } from '@/lib/constants';

/**
 * Start camera and return MediaStream
 */
export async function startCamera(): Promise<MediaStream> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS);
    return stream;
  } catch (error) {
    console.error('Camera access error:', error);
    throw new Error('Unable to access camera. Please check permissions.');
  }
}

/**
 * Stop all tracks in a MediaStream
 */
export function stopCamera(stream: MediaStream | null): void {
  if (!stream) return;
  
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

/**
 * Capture a frame from video element
 */
export function captureVideoFrame(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  options: CaptureOptions = {}
): string | null {
  // Check video element exists
  if (!video) {
    console.error('captureVideoFrame: No video element');
    return null;
  }

  // Check if video has metadata loaded
  if (!video.videoWidth || !video.videoHeight) {
    console.error('captureVideoFrame: Video metadata not loaded', {
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
      readyState: video.readyState,
      srcObject: !!video.srcObject
    });
    return null;
  }

  // Check readyState - must have current data
  if (video.readyState < 2) {
    console.error('captureVideoFrame: Video not ready (readyState < 2)', {
      readyState: video.readyState,
      HAVE_NOTHING: 0,
      HAVE_METADATA: 1,
      HAVE_CURRENT_DATA: 2
    });
    return null;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('captureVideoFrame: Cannot get canvas context');
    return null;
  }

  try {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Mirror the video (flip horizontally for selfie mode)
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
        // Luminosity method for grayscale
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      
      ctx.putImageData(imageData, 0, 0);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', CANVAS_EXPORT_QUALITY);
    console.log('captureVideoFrame: Success', {
      width: canvas.width,
      height: canvas.height,
      dataUrlLength: dataUrl.length
    });
    return dataUrl;
  } catch (error) {
    console.error('captureVideoFrame: Error during capture', error);
    return null;
  }
}

/**
 * Apply video filter CSS
 */
export function applyVideoFilter(video: HTMLVideoElement, isBW: boolean): void {
  if (!video) return;
  video.style.filter = isBW ? 'grayscale(1) contrast(1.1)' : '';
}

/**
 * Check if camera is available
 */
export async function isCameraAvailable(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === 'videoinput');
  } catch {
    return false;
  }
}
