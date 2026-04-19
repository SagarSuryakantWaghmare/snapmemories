'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { AlertTriangle, Check, Clock } from 'lucide-react';
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
  const desktopPreviewRef = useRef<HTMLVideoElement>(null);
  const mobilePreviewRef = useRef<HTMLVideoElement>(null);

  const completedPhotos = photos.filter((photo) => photo !== null).length;
  const activeCaptureStep = Math.min(currentPhotoIndex + 1, PHOTO_COUNT);

  const statusMessage = cameraError
    ? cameraError
    : isCapturing
      ? `Capturing photo ${activeCaptureStep} of ${PHOTO_COUNT} — hold still!`
      : isCameraReady
        ? 'Camera ready. Tap Capture to start!'
        : 'Starting camera…';

  // Mirror the hidden videoRef stream to visible preview videos
  useEffect(() => {
    let mounted = true;

    const updatePreviews = async () => {
      if (!mounted) return;
      const source = videoRef.current?.srcObject as MediaStream | null;
      if (!source) return;

      const mirrors = [desktopPreviewRef.current, mobilePreviewRef.current];
      for (const mirror of mirrors) {
        if (!mirror) continue;
        if (mirror.srcObject !== source) {
          mirror.srcObject = source;
          try {
            await mirror.play();
          } catch {
            // Blocked by browser policy — will play when visible
          }
        }
      }
    };

    updatePreviews();
    const timer = setTimeout(updatePreviews, 200);
    const interval = setInterval(updatePreviews, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [videoRef]);

  const videoFilter = isBW ? 'grayscale(1) contrast(1.1)' : 'none';

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col overflow-hidden relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-3 sm:p-4 safe-top pointer-events-none">
        <button
          type="button"
          id="booth-home-btn"
          onClick={onHome}
          className="pointer-events-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 backdrop-blur-md shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 flex items-center justify-center transition-colors"
          aria-label="Go back to home screen"
          title="Go home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>

        <div
          className={`pointer-events-auto rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-medium backdrop-blur transition-colors inline-flex items-center gap-1.5 ${cameraError
              ? 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
              : isCameraReady
                ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                : 'bg-white/95 dark:bg-gray-800/95 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
            }`}
          aria-live="polite"
          role="status"
          aria-label={`Camera status: ${cameraError ? 'error' : isCameraReady ? 'ready' : 'initializing'}`}
        >
          {cameraError ? <AlertTriangle className="w-4 h-4" /> : isCameraReady ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {cameraError ? 'Camera issue' : isCameraReady ? 'Camera ready' : 'Initializing…'}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="hidden"
        aria-hidden="true"
      />

      {/* Hidden master video element (used for capture) */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute -left-[9999px] top-0 w-px h-px opacity-0 pointer-events-none"
        aria-hidden="true"
      />

      {/* Main content area */}
      <main className="flex-1 flex items-center justify-center gap-4 sm:gap-6 p-3 sm:p-4 pt-16 sm:pt-20 pb-28 sm:pb-32 overflow-hidden">

        {/* Desktop live preview */}
        <div className="shrink-0 hidden md:block">
          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 text-center mb-1">Live preview</p>
          <div
            className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-1.5 shadow-lg overflow-hidden"
            style={{ width: 'min(300px, 38vw)', aspectRatio: '1/1' }}
          >
            {isCameraReady ? (
              <video
                ref={desktopPreviewRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded"
                style={{ transform: 'scaleX(-1)', filter: videoFilter }}
                aria-label="Live camera preview"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-700 rounded flex flex-col items-center justify-center gap-2">
                {cameraError ? (
                  <>
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                    <p className="text-xs text-center text-red-600 dark:text-red-400 px-2">Camera unavailable</p>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 animate-spin text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                      <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Starting camera…</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Strip preview column */}
        <div className="shrink-0">
          <div className="mb-2 flex items-center justify-between px-1">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Strip preview</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {completedPhotos}/{PHOTO_COUNT} captured
            </p>
          </div>

          <div
            className="bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-600 rounded-lg p-1.5 shadow-lg"
            style={{ width: 'min(140px, 40vw)' }}
          >
            <div className="flex flex-col gap-0.5">
              {Array.from({ length: PHOTO_COUNT }, (_, index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded overflow-hidden"
                  style={{ width: '100%', aspectRatio: '1/1' }}
                  id={`photo-cell-${index}`}
                >
                  {/* Mobile live preview in slot 0 when empty and not capturing */}
                  {!photos[index] && index === 0 && !isCapturing && (
                    <video
                      ref={mobilePreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover md:hidden"
                      style={{ transform: 'scaleX(-1)', filter: videoFilter }}
                      aria-label="Live camera preview"
                    />
                  )}

                  {/* Captured photo */}
                  {photos[index] && (
                    <Image
                      src={photos[index]!}
                      alt={`Captured photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Empty slot placeholder */}
                  {!photos[index] && (index > 0 || isCapturing) && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                      <span className="text-lg sm:text-xl font-bold">{index + 1}</span>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  <div
                    id={`countdown-${index}`}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl sm:text-5xl font-bold opacity-0 pointer-events-none transition-opacity"
                    aria-hidden="true"
                  />

                  {/* Flash overlay */}
                  <div
                    id={`flash-${index}`}
                    className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
                    aria-hidden="true"
                  />

                  {/* Active capture ring */}
                  {isCapturing && index === currentPhotoIndex && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-blue-400/80 ring-2 ring-blue-200/60 rounded" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-[7px] sm:text-[8px] text-center text-gray-400 dark:text-gray-500 mt-1 tracking-wider">
              snapmemories by sagar
            </p>
          </div>

          <p className="mt-2 text-center text-[11px] text-gray-500 dark:text-gray-400 max-w-[140px] sm:max-w-[160px] leading-tight">
            {cameraError
              ? 'Camera unavailable — use Upload instead.'
              : 'Photos fill automatically as each shot is taken.'}
          </p>
        </div>
      </main>

      {/* Bottom controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-black/10 dark:border-white/10 bg-gradient-to-t from-white via-white/95 to-white/70 dark:from-gray-800 dark:via-gray-800/95 dark:to-gray-800/70 px-4 pt-2.5 pb-3 safe-bottom backdrop-blur">
        <div className="mx-auto flex w-full max-w-md items-end justify-between gap-3">
          {/* Upload button */}
          <button
            type="button"
            id="upload-btn"
            onClick={() => fileInputRef.current?.click()}
            className="h-12 sm:h-14 min-w-14 sm:min-w-16 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 text-[11px] sm:text-xs font-semibold shadow hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 inline-flex flex-col items-center justify-center gap-0.5 transition-colors"
            aria-label="Upload photos from your device"
            title="Upload photos instead"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload
          </button>

          {/* Capture button */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              id="capture-btn"
              onClick={onRecordClick}
              disabled={recordDisabled}
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full text-white flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-2xl active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all ${isCapturing ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'
                }`}
              aria-label={
                isCapturing
                  ? `Capturing photo ${activeCaptureStep} of ${PHOTO_COUNT}`
                  : recordDisabled
                    ? 'Waiting for camera to be ready'
                    : 'Start capturing 4 photos'
              }
              title={isCapturing ? `Capturing ${activeCaptureStep}/${PHOTO_COUNT}` : 'Capture'}
            >
              {isCapturing ? (
                <svg className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.4" />
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-gray-200" aria-hidden="true" />
              )}
            </button>
            <p className="text-xs sm:text-sm text-black dark:text-white font-bold bg-white/95 dark:bg-gray-800/95 px-3 py-1 rounded-full shadow">
              {isCapturing ? `${activeCaptureStep}/${PHOTO_COUNT}` : 'Capture'}
            </p>
          </div>

          {/* B&W toggle */}
          <button
            type="button"
            id="bw-toggle-btn"
            onClick={() => onBWToggle(!isBW)}
            aria-pressed={isBW}
            className={`h-12 sm:h-14 min-w-14 sm:min-w-16 rounded-2xl border text-[11px] sm:text-xs font-semibold shadow active:scale-95 inline-flex flex-col items-center justify-center gap-0.5 transition-colors ${isBW
                ? 'bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700'
                : 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
              }`}
            aria-label={`Switch to ${isBW ? 'color' : 'black & white'} mode`}
            title={isBW ? 'Switch to color' : 'Switch to B&W'}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4a9 9 0 018 14.9A9 9 0 117 4z" />
            </svg>
            {isBW ? 'B&W' : 'Color'}
          </button>
        </div>

        {/* Progress dots */}
        <div className="mx-auto mt-2.5 flex max-w-xs items-center justify-center gap-1.5">
          {Array.from({ length: PHOTO_COUNT }, (_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${index < completedPhotos
                  ? 'w-6 bg-blue-600 dark:bg-blue-500'
                  : index === currentPhotoIndex && isCapturing
                    ? 'w-5 bg-blue-400 dark:bg-blue-400'
                    : 'w-3 bg-gray-300 dark:bg-gray-600'
                }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Status message */}
        <p
          className={`mt-2 text-center text-[11px] font-medium ${cameraError ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}
          aria-live="polite"
          role="status"
        >
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
