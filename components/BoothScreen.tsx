'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { BoothScreenProps } from '@/lib/types';
import { PHOTO_COUNT } from '@/lib/constants';

export default function BoothScreen({
  isBW,
  isCameraReady,
  cameraError,
  onBWToggle,
  onRecordClick,
  onUpload,
  onHome,
  recordDisabled,
  videoRef,
  photos,
  currentPhotoIndex,
  isCapturing,
}: BoothScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mobilePreviewRef = useRef<HTMLVideoElement>(null);
  const completedPhotos = photos.filter((photo) => photo !== null).length;
  const activeCaptureStep = Math.min(currentPhotoIndex + 1, PHOTO_COUNT);
  const statusMessage = cameraError
    ? cameraError
    : isCapturing
      ? `Capturing photo ${activeCaptureStep} of ${PHOTO_COUNT}. Hold still.`
      : isCameraReady
        ? 'Camera is ready. Tap capture to start.'
        : 'Starting camera...';

  // Mirror the videoRef stream to the preview videos
  useEffect(() => {
    let mounted = true;

    const updatePreviewStreams = async () => {
      if (!mounted) return;
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        
        if (previewVideoRef.current && previewVideoRef.current.srcObject !== stream) {
          previewVideoRef.current.srcObject = stream;
          try {
            await previewVideoRef.current.play();
          } catch (error) {
            console.warn('Desktop preview autoplay was blocked:', error);
          }
        }
        
        if (mobilePreviewRef.current && mobilePreviewRef.current.srcObject !== stream) {
          mobilePreviewRef.current.srcObject = stream;
          try {
            await mobilePreviewRef.current.play();
          } catch (error) {
            console.warn('Mobile preview autoplay was blocked:', error);
          }
        }
      }
    };

    // Update immediately
    updatePreviewStreams();
    
    // Also update on a slight delay to catch stream updates
    const timer = setTimeout(updatePreviewStreams, 200);
    
    // Also update periodically to ensure video stays playing
    const interval = setInterval(updatePreviewStreams, 1000);
    
    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [videoRef]);

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-3 sm:p-4 safe-top pointer-events-none">
        <button
          type="button"
          onClick={onHome}
          className="pointer-events-auto h-10 w-10 sm:h-11 sm:w-11 rounded-full border border-white/30 bg-black/75 text-white backdrop-blur-md shadow-lg hover:bg-black/90 active:scale-95 flex items-center justify-center"
          aria-label="Go to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        <div
          className={`pointer-events-auto rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-medium backdrop-blur ${
            cameraError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white/95 text-gray-700 border-gray-200'
          }`}
          aria-live="polite"
        >
          {cameraError ? 'Camera issue' : isCameraReady ? 'Camera ready' : 'Initializing camera'}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="hidden"
      />

      <main className="flex-1 flex items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 pt-16 sm:pt-20 pb-28 sm:pb-32 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute -left-[9999px] top-0 w-px h-px opacity-0 pointer-events-none"
        />
        
        <div className="shrink-0 hidden md:block">
          <div
            className="bg-white border-2 border-black rounded-lg p-1.5 shadow-lg overflow-hidden"
            style={{ width: 'min(320px, 40vw)', aspectRatio: '1/1' }}
          >
            <video
              ref={previewVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
              style={{
                transform: 'scaleX(-1)',
                filter: isBW ? 'grayscale(1) contrast(1.1)' : 'none',
              }}
            />
          </div>
        </div>
        
        <div className="shrink-0">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-gray-700">Strip preview</p>
            <p className="text-[11px] text-gray-500">
              {completedPhotos}/{PHOTO_COUNT} captured
            </p>
          </div>

          <div
            className="bg-white border-2 border-black rounded-lg p-1.5 shadow-lg"
            style={{ width: 'min(140px, 40vw)' }}
          >
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: PHOTO_COUNT }, (_, index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
                  style={{ width: '100%', aspectRatio: '1/1' }}
                  id={`photo-cell-${index}`}
                >
                  {!photos[index] && index === 0 && !isCapturing && (
                    <video
                      ref={mobilePreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover md:hidden"
                      style={{
                        transform: 'scaleX(-1)',
                        filter: isBW ? 'grayscale(1) contrast(1.1)' : 'none',
                      }}
                    />
                  )}
                  
                  {photos[index] && (
                    <Image
                      src={photos[index]!}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}

                  {!photos[index] && (index > 0 || isCapturing) && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-lg sm:text-xl font-bold">{index + 1}</span>
                    </div>
                  )}

                  <div
                    id={`countdown-${index}`}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl sm:text-5xl font-bold opacity-0 pointer-events-none transition-opacity"
                  />

                  <div
                    id={`flash-${index}`}
                    className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
                  />

                  {isCapturing && index === currentPhotoIndex && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-white/80 shadow-[inset_0_0_0_2px_rgba(0,0,0,0.35)]" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[7px] sm:text-[8px] text-center text-gray-400 mt-1 tracking-wider">
              snapmemories by sagar
            </p>
          </div>

          <p className="mt-2 text-center text-[11px] text-gray-500">
            {cameraError
              ? 'Use Upload if camera permission is unavailable.'
              : 'Photos fill in automatically as each shot is captured.'}
          </p>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 bg-gradient-to-t from-white via-white/95 to-white/70 px-4 pt-2.5 pb-3 safe-bottom backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-end justify-between gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="h-12 sm:h-14 min-w-[4.5rem] sm:min-w-[5rem] rounded-2xl border border-black/15 bg-white text-black text-[11px] sm:text-xs font-semibold shadow hover:bg-gray-50 active:scale-95 inline-flex flex-col items-center justify-center gap-0.5"
            aria-label="Upload photos from device"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </button>

          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              onClick={onRecordClick}
              disabled={recordDisabled || isCapturing || !!cameraError}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black text-white flex items-center justify-center border-4 border-white shadow-2xl hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Capture photos"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white" />
            </button>
            <p className="text-xs sm:text-sm text-black font-bold bg-white/95 px-2.5 py-0.5 rounded-full shadow">
              {isCapturing ? `Capturing ${activeCaptureStep}/${PHOTO_COUNT}` : 'Capture'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onBWToggle(!isBW)}
            aria-pressed={isBW}
            className={`h-12 sm:h-14 min-w-[4.5rem] sm:min-w-[5rem] rounded-2xl border text-[11px] sm:text-xs font-semibold shadow active:scale-95 inline-flex flex-col items-center justify-center gap-0.5 ${
              isBW ? 'bg-black text-white border-black' : 'bg-white text-black border-black/15 hover:bg-gray-50'
            }`}
            aria-label="Toggle black and white mode"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4a9 9 0 018 14.9A9 9 0 117 4z" />
            </svg>
            {isBW ? 'B&W' : 'Color'}
          </button>
        </div>

        <div className="mx-auto mt-2.5 flex max-w-xs items-center justify-center gap-1.5">
          {Array.from({ length: PHOTO_COUNT }, (_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index < completedPhotos
                  ? 'w-6 bg-black'
                  : index === currentPhotoIndex && isCapturing
                    ? 'w-5 bg-gray-600'
                    : 'w-3 bg-gray-300'
              }`}
            />
          ))}
        </div>

        <p className="mt-2 text-center text-[11px] text-gray-500" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
