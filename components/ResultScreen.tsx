'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Download, RotateCcw, ZoomIn, Check } from 'lucide-react';
import { ResultScreenProps } from '@/lib/types';
import { FILTERS } from '@/lib/constants';
import { HEART_CLIP_POLYGON } from '@/lib/frame-shapes';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';
import FloatingNav from './FloatingNav';

function Spinner({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin text-accent`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.22" />
      <path
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function ResultScreen({
  photos,
  showPrinting,
  showFinalKiosk,
  selectedFrame,
  currentFilter,
  onFilterChange,
  onDownload,
  isDownloading = false,
  onRetake,
  onHome,
  onImageClick,
}: ResultScreenProps) {
  const root = useRef<HTMLDivElement>(null);
  const hasAnyPhoto = photos.some((photo) => photo !== null);
  const frameBorderWidth = Math.max(1, selectedFrame.borderWidth);

  // Printer animation.
  useGSAP(
    () => {
      if (!showPrinting || reducedMotion()) return;
      const tl = gsap.timeline();
      tl.set('[data-print-strip]', { yPercent: -100 })
        .from('[data-printer]', { y: -22, autoAlpha: 0, duration: DUR.base, ease: EASE.pop })
        .to('[data-led]', { opacity: 0.25, duration: 0.3, repeat: -1, yoyo: true }, 0)
        .to('[data-print-strip]', { yPercent: 0, duration: 1.25, ease: 'power1.inOut' }, '-=0.1')
        .to('[data-printer]', { x: 1.6, duration: 0.05, repeat: 20, yoyo: true }, '<');
    },
    { scope: root, dependencies: [showPrinting] },
  );

  // Final reveal.
  useGSAP(
    () => {
      if (!showFinalKiosk || reducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from('[data-result-reveal]', {
          y: 26,
          autoAlpha: 0,
          duration: DUR.base,
          stagger: 0.09,
          clearProps: 'transform',
        })
        .from(
          '[data-strip-card]',
          { scale: 0.84, autoAlpha: 0, duration: DUR.slow, ease: EASE.pop, clearProps: 'transform' },
          '-=0.3',
        )
        .from(
          '[data-filter-chip]',
          {
            y: 14,
            scale: 0.9,
            autoAlpha: 0,
            duration: DUR.fast,
            ease: EASE.pop,
            stagger: 0.05,
            clearProps: 'transform',
          },
          '-=0.55',
        )
        .from('[data-action-bar]', { y: 46, autoAlpha: 0, duration: DUR.base }, '-=0.4');
    },
    { scope: root, dependencies: [showFinalKiosk] },
  );

  // Crossfade the strip whenever the filter changes.
  useGSAP(
    () => {
      if (!showFinalKiosk || reducedMotion()) return;
      gsap.from('[data-result-photo]', {
        autoAlpha: 0.1,
        duration: DUR.fast,
        stagger: 0.04,
        ease: EASE.soft,
      });
    },
    { scope: root, dependencies: [currentFilter] },
  );

  return (
    <div ref={root} className="grain relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <FloatingNav showBack onBack={onHome} step={3} />

      <main className="flex flex-1 flex-col items-center gap-5 px-5 pb-40 pt-28">
        {/* Printing */}
        {showPrinting && (
          <div className="flex flex-col items-center">
            <div
              data-printer
              className="relative z-10 w-[260px] rounded-2xl bg-ink px-4 pb-3 pt-3 shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  snapmemories
                </span>
                <span data-led className="h-2 w-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
              </div>
              <div className="mt-3 h-2.5 w-full rounded-full bg-black/70 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" />
            </div>

            <div className="-mt-1 overflow-hidden" style={{ width: 134 }}>
              <div data-print-strip className="rounded-b-lg bg-card p-1.5 shadow-card">
                <div className="flex flex-col gap-1">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-[3px] bg-paper-deep">
                      {photo && <Image src={photo} alt="" fill className="object-cover" sizes="134px" />}
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-center text-[6px] tracking-[0.18em] text-ink-faint">
                  snapmemories
                </p>
              </div>
            </div>

            <p className="mt-6 text-sm font-medium text-ink-soft">Printing your strip…</p>
          </div>
        )}

        {/* Transition */}
        {!showPrinting && !showFinalKiosk && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-line bg-card px-8 py-7 shadow-card">
            <Spinner />
            <p className="text-sm font-medium text-ink-soft">Preparing your strip…</p>
          </div>
        )}

        {/* Final result */}
        {showFinalKiosk && (
          <>
            <header data-result-reveal className="text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-deep">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
                All done
              </span>
              <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
                Your strip is ready
              </h1>
              <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <ZoomIn className="h-3.5 w-3.5" />
                Tap a photo to preview it larger
              </p>
            </header>

            {/* Filters */}
            <div
              data-result-reveal
              className="flex max-w-sm flex-wrap justify-center gap-2"
            >
              {FILTERS.map((filter) => {
                const active = currentFilter === filter.value;
                return (
                  <button
                    key={filter.value}
                    type="button"
                    data-filter-chip
                    onClick={() => onFilterChange(filter.value)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-[background-color,color,border-color,box-shadow,transform] active:scale-95 ${
                      active
                        ? 'border-accent bg-accent text-white shadow-accent'
                        : 'border-line bg-card text-ink-soft hover:border-line-bold hover:text-ink'
                    }`}
                    title={`Apply the ${filter.name} filter`}
                  >
                    {filter.name}
                  </button>
                );
              })}
            </div>

            {/* Strip */}
            <div
              data-strip-card
              className="rounded-2xl p-3 shadow-lift"
              style={{
                width: 'min(178px, 52vw)',
                background: selectedFrame.backgroundColor,
                border:
                  selectedFrame.shape === 'polaroid'
                    ? '1px solid #e3dac8'
                    : `${frameBorderWidth}px solid ${selectedFrame.borderColor}`,
              }}
            >
              <div className="flex flex-col gap-1.5">
                {photos.map((photo, i) => {
                  const isPolaroid = selectedFrame.shape === 'polaroid';
                  const mediaStyle =
                    selectedFrame.shape === 'heart'
                      ? {
                          clipPath: HEART_CLIP_POLYGON,
                          border: `${frameBorderWidth}px solid ${selectedFrame.borderColor}`,
                        }
                      : selectedFrame.shape === 'circle'
                        ? {
                            borderRadius: '50%',
                            border: `${frameBorderWidth}px solid ${selectedFrame.borderColor}`,
                          }
                        : {
                            borderRadius: '2px',
                            border:
                              selectedFrame.shape === 'rectangle'
                                ? `${frameBorderWidth}px solid ${selectedFrame.borderColor}`
                                : '1px solid #e3dac8',
                          };

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => photo && onImageClick(photo)}
                      disabled={!photo}
                      aria-label={photo ? `Preview photo ${i + 1}` : `Photo slot ${i + 1} is empty`}
                      className="group block w-full bg-transparent p-0 text-left disabled:cursor-default"
                    >
                      <div
                        style={
                          isPolaroid
                            ? {
                                background: selectedFrame.backgroundColor,
                                border: `1px solid ${selectedFrame.borderColor}`,
                                borderRadius: '2px',
                                padding: Math.min(selectedFrame.borderWidth, 8),
                                paddingBottom: Math.min(Math.round(selectedFrame.borderWidth * 1.6), 16),
                              }
                            : undefined
                        }
                      >
                        <div
                          className="relative aspect-square w-full overflow-hidden bg-paper-deep"
                          style={mediaStyle}
                        >
                          {photo ? (
                            <>
                              <Image
                                data-result-photo
                                src={photo}
                                alt={`Photo ${i + 1}`}
                                fill
                                sizes="200px"
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <span className="pointer-events-none absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-full bg-ink/70 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                <ZoomIn className="h-3.5 w-3.5" />
                              </span>
                            </>
                          ) : (
                            <div className="grid h-full w-full place-items-center text-ink-faint">
                              <span className="font-display text-lg">{i + 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-center text-[8px] tracking-[0.2em] text-ink-faint">
                snapmemories
              </p>
            </div>

            {!hasAnyPhoto && (
              <p data-result-reveal className="text-center text-xs text-accent-deep">
                No photos available — retake to capture again.
              </p>
            )}
          </>
        )}
      </main>

      {/* Action bar */}
      {showFinalKiosk && (
        <div
          data-action-bar
          className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/85 px-5 pb-4 pt-3 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-md gap-2.5">
            <button
              type="button"
              onClick={onRetake}
              className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full border border-line bg-card px-4 py-3 text-sm font-semibold text-ink shadow-soft transition-[background-color,box-shadow,transform] hover:bg-paper-soft hover:shadow-card active:scale-[0.98]"
              aria-label="Retake your photos"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Retake
            </button>
            <button
              type="button"
              onClick={onDownload}
              disabled={!hasAnyPhoto || isDownloading}
              className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-4 py-3 text-sm font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep hover:shadow-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={isDownloading ? 'Downloading' : 'Download your photo strip'}
            >
              {isDownloading ? (
                <>
                  <Spinner className="h-4 w-4 text-white" />
                  Saving…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
