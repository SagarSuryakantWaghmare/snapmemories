'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageIcon, ArrowRight } from 'lucide-react';
import { FrameSelectionProps, Frame } from '@/lib/types';
import { FRAMES } from '@/lib/constants';
import { HEART_CLIP_POLYGON } from '@/lib/frame-shapes';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';
import FloatingNav from './FloatingNav';

const HEART_PATH =
  'M50 88 C25 65, 5 50, 5 30 C5 15, 20 5, 35 5 C45 5, 50 15, 50 15 C50 15, 55 5, 65 5 C80 5, 95 15, 95 30 C95 50, 75 65, 50 88 Z';

export default function FrameSelection({
  photos,
  currentFrameIndex,
  onFrameChange,
  onSelectFrame,
  onHome,
}: FrameSelectionProps) {
  const root = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const frameButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedFrame = FRAMES[currentFrameIndex];
  const hasAnyPhoto = photos.some((p) => p !== null);

  const goToPrevFrame = useCallback(() => {
    onFrameChange(currentFrameIndex > 0 ? currentFrameIndex - 1 : FRAMES.length - 1);
  }, [currentFrameIndex, onFrameChange]);

  const goToNextFrame = useCallback(() => {
    onFrameChange(currentFrameIndex < FRAMES.length - 1 ? currentFrameIndex + 1 : 0);
  }, [currentFrameIndex, onFrameChange]);

  // Keep the selected frame centred in the carousel.
  useEffect(() => {
    const container = carouselRef.current;
    const selectedButton = frameButtonRefs.current[currentFrameIndex];
    if (!container || !selectedButton) return;

    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedButton.getBoundingClientRect();
      const offset =
        selectedRect.left - containerRect.left - (containerRect.width / 2 - selectedRect.width / 2);
      container.scrollBy({ left: offset, behavior: 'smooth' });
    });
  }, [currentFrameIndex]);

  // Arrow-key navigation.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevFrame();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNextFrame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToPrevFrame, goToNextFrame]);

  // Entrance.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from('[data-reveal]', {
          y: 26,
          autoAlpha: 0,
          duration: DUR.base,
          stagger: 0.09,
          clearProps: 'transform',
        })
        .from('[data-cta-bar]', { y: 42, autoAlpha: 0, duration: DUR.base }, '-=0.4');
    },
    { scope: root },
  );

  // Re-settle the strip preview each time the frame changes.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        '[data-strip-preview]',
        { scale: 0.94, autoAlpha: 0.3 },
        { scale: 1, autoAlpha: 1, duration: DUR.fast, ease: EASE.out },
      );
    },
    { scope: root, dependencies: [currentFrameIndex] },
  );

  const renderFramePreview = (frame: Frame, isSelected: boolean, size: 'small' | 'large') => {
    const box = size === 'large' ? 'h-[5.5rem] w-[5.5rem]' : 'h-16 w-16';
    const state = isSelected
      ? 'opacity-100'
      : 'opacity-55 group-hover:opacity-90';
    const photoPreview = photos.find((p) => p !== null) ?? null;

    if (frame.shape === 'heart') {
      return (
        <div className={`${box} ${state} grid place-items-center transition-opacity`}>
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <defs>
              <clipPath id={`heart-${frame.id}-${size}`}>
                <path d={HEART_PATH} />
              </clipPath>
            </defs>
            {photoPreview ? (
              <image
                href={photoPreview}
                x="6" y="4" width="88" height="88"
                clipPath={`url(#heart-${frame.id}-${size})`}
                preserveAspectRatio="xMidYMid slice"
              />
            ) : (
              <path d={HEART_PATH} fill="#e4dcc9" />
            )}
            <path d={HEART_PATH} fill="none" stroke={frame.borderColor} strokeWidth={frame.borderWidth} />
          </svg>
        </div>
      );
    }

    if (frame.shape === 'circle') {
      return (
        <div
          className={`${box} ${state} relative overflow-hidden rounded-full transition-opacity`}
          style={{ border: `${Math.min(frame.borderWidth, 3)}px solid ${frame.borderColor}` }}
        >
          {photoPreview ? (
            <Image src={photoPreview} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-paper-deep">
              <ImageIcon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
            </div>
          )}
        </div>
      );
    }

    if (frame.shape === 'polaroid') {
      return (
        <div
          className={`${state} transition-opacity`}
          style={{
            background: '#ffffff',
            padding: 6,
            paddingBottom: 14,
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(29,26,21,.18)',
          }}
        >
          <div
            className={`${size === 'large' ? 'h-[4.25rem] w-[4.25rem]' : 'h-12 w-12'} relative overflow-hidden bg-paper-deep`}
          >
            {photoPreview ? (
              <Image src={photoPreview} alt="" fill className="object-cover" sizes="80px" />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <ImageIcon className="h-5 w-5 text-ink-faint" strokeWidth={1.5} />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Rectangle
    return (
      <div
        className={`${box} ${state} relative overflow-hidden rounded-[3px] transition-opacity`}
        style={{ border: `${Math.min(frame.borderWidth, 4)}px solid ${frame.borderColor}` }}
      >
        {photoPreview ? (
          <Image src={photoPreview} alt="" fill className="object-cover" sizes="96px" />
        ) : (
          <div className="grid h-full w-full place-items-center bg-paper-deep">
            <ImageIcon className="h-6 w-6 text-ink-faint" strokeWidth={1.5} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={root} className="grain relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <FloatingNav showBack onBack={onHome} step={2} />

      <main className="flex flex-1 flex-col">
        <header data-reveal className="px-6 pb-2 pt-24 text-center sm:pt-28">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            Step two
          </span>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Choose your frame</h1>
          <p className="mt-1.5 text-sm text-ink-soft">
            Swipe, tap a frame, or use the{' '}
            <kbd className="rounded border border-line bg-card px-1.5 py-0.5 text-[11px] font-semibold">
              ←
            </kbd>{' '}
            <kbd className="rounded border border-line bg-card px-1.5 py-0.5 text-[11px] font-semibold">
              →
            </kbd>{' '}
            keys.
          </p>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-3 pb-28">
          {/* Carousel */}
          <div data-reveal className="relative flex w-full max-w-md items-center justify-center">
            <button
              type="button"
              onClick={goToPrevFrame}
              className="absolute left-1 z-20 grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink shadow-card hover:bg-paper-soft active:scale-95"
              aria-label="Previous frame"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={carouselRef}
              className="scrollbar-hide flex snap-x snap-mandatory items-center gap-4 overflow-x-auto px-16 py-4"
              role="listbox"
              aria-label="Frame styles"
            >
              {FRAMES.map((frame, index) => {
                const isSelected = currentFrameIndex === index;
                return (
                  <button
                    key={frame.id}
                    ref={(node) => {
                      frameButtonRefs.current[index] = node;
                    }}
                    type="button"
                    onClick={() => onFrameChange(index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-label={`Select ${frame.name} frame`}
                    className="group flex shrink-0 snap-center flex-col items-center gap-2"
                  >
                    <div
                      className={`grid h-28 w-28 place-items-center rounded-2xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'scale-105 border-accent bg-card shadow-card'
                          : 'border-line bg-card/70 hover:border-line-bold'
                      }`}
                    >
                      {renderFramePreview(frame, isSelected, isSelected ? 'large' : 'small')}
                    </div>
                    <span
                      className={`text-xs font-semibold transition-colors ${
                        isSelected ? 'text-ink' : 'text-ink-faint'
                      }`}
                    >
                      {frame.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={goToNextFrame}
              className="absolute right-1 z-20 grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink shadow-card hover:bg-paper-soft active:scale-95"
              aria-label="Next frame"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Dots */}
          <div data-reveal className="flex gap-1.5">
            {FRAMES.map((frame, index) => (
              <button
                key={frame.id}
                type="button"
                onClick={() => onFrameChange(index)}
                aria-label={`Go to ${frame.name}`}
                className={`h-2 rounded-full transition-all ${
                  currentFrameIndex === index ? 'w-5 bg-accent' : 'w-2 bg-line-bold hover:bg-ink-faint'
                }`}
              />
            ))}
          </div>

          {/* Strip preview */}
          <div data-reveal className="flex flex-col items-center gap-2">
            <p className="text-xs text-ink-soft">
              Preview · <span className="font-semibold text-ink">{selectedFrame.name}</span>
            </p>
            <div
              data-strip-preview
              className="rounded-xl p-2 shadow-card"
              style={{
                background: selectedFrame.backgroundColor,
                border:
                  selectedFrame.shape !== 'polaroid'
                    ? `${Math.max(1, selectedFrame.borderWidth)}px solid ${selectedFrame.borderColor}`
                    : '1px solid #e3dac8',
              }}
            >
              <div className="flex flex-col gap-1" style={{ width: 62 }}>
                {photos.map((photo, i) => {
                  const isPolaroid = selectedFrame.shape === 'polaroid';
                  const previewBorderWidth = Math.max(1, selectedFrame.borderWidth);
                  const shapeStyle =
                    selectedFrame.shape === 'heart'
                      ? {
                          clipPath: HEART_CLIP_POLYGON,
                          border: `${previewBorderWidth}px solid ${selectedFrame.borderColor}`,
                        }
                      : selectedFrame.shape === 'circle'
                        ? {
                            borderRadius: '50%',
                            border: `${previewBorderWidth}px solid ${selectedFrame.borderColor}`,
                          }
                        : {
                            borderRadius: '2px',
                            border: `${previewBorderWidth}px solid ${selectedFrame.borderColor}`,
                          };

                  return (
                    <div
                      key={i}
                      style={
                        isPolaroid
                          ? {
                              background: selectedFrame.backgroundColor,
                              border: `1px solid ${selectedFrame.borderColor}`,
                              borderRadius: '2px',
                              padding: Math.min(selectedFrame.borderWidth, 6),
                              paddingBottom: Math.min(Math.round(selectedFrame.borderWidth * 1.6), 12),
                            }
                          : undefined
                      }
                    >
                      <div
                        className="relative overflow-hidden bg-paper-deep"
                        style={{ aspectRatio: '1/1', ...shapeStyle }}
                      >
                        {photo ? (
                          <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" sizes="96px" />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-ink-faint">
                            <span className="text-xs font-semibold">{i + 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-1 text-center text-[6px] tracking-[0.18em] text-ink-faint">
                snapmemories
              </p>
            </div>
            <p className="text-[11px] text-ink-faint">Your download will match this crop &amp; shape.</p>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div
        data-cta-bar
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/85 px-5 pb-4 pt-3 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={onSelectFrame}
          disabled={!hasAnyPhoto}
          className="group mx-auto flex min-h-14 w-full max-w-md items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-base font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep hover:shadow-lift active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={hasAnyPhoto ? `Continue with the ${selectedFrame.name} frame` : 'No photos available'}
        >
          Continue to filters
          <ArrowRight
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </button>
        {!hasAnyPhoto && (
          <p className="mt-1.5 text-center text-xs text-accent-deep">
            No photos found — go back to capture or upload first.
          </p>
        )}
      </div>
    </div>
  );
}
