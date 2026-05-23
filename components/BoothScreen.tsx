'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { Home, AlertTriangle, Check, Clock, Upload, Contrast } from 'lucide-react';
import { BoothScreenProps } from '@/lib/types';
import { PHOTO_COUNT } from '@/lib/constants';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';

function Spinner({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.22" />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

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
  const root = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLVideoElement>(null);

  const completedPhotos = photos.filter((photo) => photo !== null).length;
  const activeCaptureStep = Math.min(currentPhotoIndex + 1, PHOTO_COUNT);
  const videoFilter = isBW ? 'grayscale(1) contrast(1.1)' : 'none';

  const statusMessage = cameraError
    ? cameraError
    : isCapturing
      ? `Capturing photo ${activeCaptureStep} of ${PHOTO_COUNT} — hold still!`
      : isCameraReady
        ? 'Camera ready — tap the shutter to take all four shots.'
        : 'Warming up the camera…';

  // Mirror the hidden capture stream into the visible preview.
  useEffect(() => {
    let mounted = true;

    const syncPreview = async () => {
      if (!mounted) return;
      const source = videoRef.current?.srcObject as MediaStream | null;
      const mirror = previewRef.current;
      if (!source || !mirror || mirror.srcObject === source) return;
      mirror.srcObject = source;
      try {
        await mirror.play();
      } catch {
        // Autoplay may be blocked — it resumes once visible.
      }
    };

    syncPreview();
    const timer = setTimeout(syncPreview, 200);
    const interval = setInterval(syncPreview, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [videoRef]);

  // Entrance.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from('[data-booth-top]', { y: -22, autoAlpha: 0, duration: DUR.base })
        .from('[data-preview]', { scale: 0.9, autoAlpha: 0, duration: DUR.base, ease: EASE.pop, clearProps: 'transform' }, '-=0.25')
        .from(
          '[data-shot]',
          { y: 18, scale: 0.8, autoAlpha: 0, duration: DUR.fast, ease: EASE.pop, stagger: 0.06, clearProps: 'transform' },
          '-=0.2',
        )
        .from('[data-controls]', { y: 48, autoAlpha: 0, duration: DUR.base }, '-=0.3');
    },
    { scope: root },
  );

  // Pop the most recently captured photo into its slot.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      const idx = completedPhotos - 1;
      if (idx < 0) return;
      const fill = root.current?.querySelector(`[data-shot="${idx}"] [data-shot-fill]`);
      if (fill) {
        gsap.from(fill, { scale: 1.35, autoAlpha: 0, duration: DUR.fast, ease: EASE.pop });
      }
    },
    { scope: root, dependencies: [completedPhotos] },
  );

  // Sonar halo around the shutter while it is ready and idle.
  useGSAP(
    () => {
      if (reducedMotion() || recordDisabled || isCapturing) return;
      gsap.fromTo(
        '[data-halo]',
        { scale: 0.92, opacity: 0.45 },
        { scale: 1.9, opacity: 0, duration: 1.9, repeat: -1, ease: 'power1.out' },
      );
    },
    { scope: root, dependencies: [recordDisabled, isCapturing] },
  );

  return (
    <div ref={root} className="grain relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Top bar */}
      <div
        data-booth-top
        className="safe-top fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-3 p-3 sm:p-4"
      >
        <button
          type="button"
          onClick={onHome}
          className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-card/85 pl-2.5 pr-4 text-sm font-medium text-ink shadow-soft backdrop-blur-md hover:bg-card hover:shadow-card active:scale-95"
          aria-label="Go back to home screen"
          title="Go home"
        >
          <Home className="h-4 w-4" aria-hidden="true" />
          Home
        </button>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold shadow-soft backdrop-blur-md ${
            cameraError
              ? 'border-accent/40 bg-accent-soft text-accent-deep'
              : isCameraReady
                ? 'border-line bg-card/85 text-ink'
                : 'border-line bg-card/85 text-ink-soft'
          }`}
          role="status"
          aria-live="polite"
        >
          {cameraError ? (
            <AlertTriangle className="h-3.5 w-3.5" />
          ) : isCameraReady ? (
            <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />
          ) : (
            <Clock className="h-3.5 w-3.5 animate-spin" />
          )}
          {cameraError ? 'Camera issue' : isCameraReady ? 'Camera ready' : 'Initializing'}
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

      {/* Hidden master capture video */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px opacity-0"
        aria-hidden="true"
      />

      {/* Stage */}
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-5 pb-44 pt-24 sm:gap-5 sm:pt-28">
        {/* Live preview */}
        <div
          data-preview
          className="relative w-[min(26rem,84vw)] rounded-[1.9rem] bg-card p-2.5 shadow-lift ring-1 ring-line"
        >
          <div className="relative aspect-square overflow-hidden rounded-[1.45rem] bg-ink">
            {isCameraReady ? (
              <video
                ref={previewRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover"
                style={{ transform: 'scaleX(-1)', filter: videoFilter }}
                aria-label="Live camera preview"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-paper-deep to-cream text-ink-soft">
                {cameraError ? (
                  <>
                    <AlertTriangle className="h-9 w-9 text-accent" />
                    <p className="px-6 text-center text-sm">Camera unavailable — use Upload below.</p>
                  </>
                ) : (
                  <>
                    <Spinner className="h-8 w-8" />
                    <p className="text-sm">Starting camera…</p>
                  </>
                )}
              </div>
            )}

            {/* Corner framing marks */}
            {isCameraReady && (
              <div className="pointer-events-none absolute inset-3" aria-hidden="true">
                {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'left-0 bottom-0 border-b-2 border-l-2', 'right-0 bottom-0 border-b-2 border-r-2'].map(
                  (pos) => (
                    <span key={pos} className={`absolute h-6 w-6 rounded-[3px] border-white/70 ${pos}`} />
                  ),
                )}
              </div>
            )}

            {/* Live / capture badge */}
            {isCameraReady && (
              <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                <span
                  className={`h-2 w-2 rounded-full ${isCapturing ? 'bg-accent' : 'bg-white'} ${
                    isCapturing ? 'animate-pulse' : ''
                  }`}
                />
                {isCapturing ? `Shot ${activeCaptureStep}/${PHOTO_COUNT}` : 'Live'}
              </div>
            )}

            {/* Countdown overlay — animated by page.tsx via GSAP */}
            <div
              id="countdown-overlay"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              style={{ opacity: 0 }}
              aria-hidden="true"
            >
              <span className="font-display text-[7rem] font-semibold leading-none text-white drop-shadow-[0_6px_20px_rgba(0,0,0,0.55)]">
                3
              </span>
            </div>

            {/* Flash overlay — animated by page.tsx via GSAP */}
            <div
              id="flash-overlay"
              className="pointer-events-none absolute inset-0 bg-white"
              style={{ opacity: 0 }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Filmstrip progress */}
        <div className="w-[min(26rem,84vw)] rounded-2xl bg-card/80 p-2 shadow-soft ring-1 ring-line backdrop-blur">
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: PHOTO_COUNT }, (_, index) => {
              const isActive = isCapturing && index === currentPhotoIndex;
              const photo = photos[index];
              return (
                <div
                  key={index}
                  data-shot={index}
                  className={`relative aspect-square overflow-hidden rounded-xl ring-1 transition-colors ${
                    isActive ? 'ring-2 ring-accent' : photo ? 'ring-line' : 'ring-line'
                  }`}
                >
                  {photo ? (
                    <Image
                      data-shot-fill
                      src={photo}
                      alt={`Captured photo ${index + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-paper-deep to-cream">
                      <span className="font-display text-lg font-semibold text-ink-faint">
                        {index + 1}
                      </span>
                    </div>
                  )}
                  {isActive && !photo && (
                    <div className="absolute inset-0 bg-accent/10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom controls */}
      <div
        data-controls
        className="safe-bottom fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper/85 px-5 pb-3 pt-3 backdrop-blur-md"
      >
        <div className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
          {/* Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-2xl border border-line bg-card text-[11px] font-semibold text-ink-soft shadow-soft hover:-translate-y-0.5 hover:text-ink hover:shadow-card active:translate-y-0"
            aria-label="Upload photos from your device"
            title="Upload photos instead"
          >
            <Upload className="h-5 w-5" aria-hidden="true" />
            Upload
          </button>

          {/* Shutter */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="relative grid place-items-center">
              <span
                data-halo
                className="absolute h-20 w-20 rounded-full bg-accent"
                style={{ opacity: 0 }}
                aria-hidden="true"
              />
              <button
                type="button"
                onClick={onRecordClick}
                disabled={recordDisabled}
                className={`relative grid h-20 w-20 place-items-center rounded-full border-4 border-card text-white shadow-lift transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 ${
                  isCapturing ? 'bg-accent-deep' : 'bg-accent hover:scale-105'
                }`}
                aria-label={
                  isCapturing
                    ? `Capturing photo ${activeCaptureStep} of ${PHOTO_COUNT}`
                    : recordDisabled
                      ? 'Waiting for the camera'
                      : 'Capture four photos'
                }
                title={isCapturing ? `Capturing ${activeCaptureStep}/${PHOTO_COUNT}` : 'Capture'}
              >
                {isCapturing ? (
                  <Spinner className="h-8 w-8" />
                ) : (
                  <span className="h-12 w-12 rounded-full bg-card ring-2 ring-accent/30" aria-hidden="true" />
                )}
              </button>
            </div>
            <span className="text-xs font-semibold text-ink">
              {isCapturing ? `${activeCaptureStep} / ${PHOTO_COUNT}` : 'Capture'}
            </span>
          </div>

          {/* B&W toggle */}
          <button
            type="button"
            onClick={() => onBWToggle(!isBW)}
            aria-pressed={isBW}
            className={`flex h-14 w-16 flex-col items-center justify-center gap-0.5 rounded-2xl border text-[11px] font-semibold shadow-soft hover:-translate-y-0.5 hover:shadow-card active:translate-y-0 ${
              isBW
                ? 'border-ink bg-ink text-white'
                : 'border-line bg-card text-ink-soft hover:text-ink'
            }`}
            aria-label={`Switch to ${isBW ? 'colour' : 'black and white'} mode`}
            title={isBW ? 'Switch to colour' : 'Switch to B&W'}
          >
            <Contrast className="h-5 w-5" aria-hidden="true" />
            {isBW ? 'B&W' : 'Colour'}
          </button>
        </div>

        {/* Progress dots */}
        <div className="mx-auto mt-3 flex max-w-xs items-center justify-center gap-2">
          {Array.from({ length: PHOTO_COUNT }, (_, index) => (
            <span
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index < completedPhotos
                  ? 'w-7 bg-accent'
                  : index === currentPhotoIndex && isCapturing
                    ? 'w-6 bg-ink animate-pulse'
                    : 'w-2.5 bg-line-bold'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Status */}
        <p
          className={`mt-2 text-center text-[12px] font-medium ${
            cameraError ? 'text-accent-deep' : 'text-ink-soft'
          }`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      </div>
    </div>
  );
}
