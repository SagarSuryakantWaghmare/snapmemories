'use client';

import { useRef, useEffect, useCallback } from 'react';
import { FrameSelectionProps, Frame } from '@/lib/types';
import { FRAMES } from '@/lib/constants';
import { HEART_CLIP_POLYGON } from '@/lib/frame-shapes';
import Image from 'next/image';
import FloatingNav from './FloatingNav';

export default function FrameSelection({
  photos,
  currentFrameIndex,
  onFrameChange,
  onSelectFrame,
  onHome,
}: FrameSelectionProps) {
  const selectedFrame = FRAMES[currentFrameIndex];
  const carouselRef = useRef<HTMLDivElement>(null);
  const frameButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const hasAnyPhoto = photos.some((p) => p !== null);

  const goToPrevFrame = useCallback(() => {
    const newIndex = currentFrameIndex > 0 ? currentFrameIndex - 1 : FRAMES.length - 1;
    onFrameChange(newIndex);
  }, [currentFrameIndex, onFrameChange]);

  const goToNextFrame = useCallback(() => {
    const newIndex = currentFrameIndex < FRAMES.length - 1 ? currentFrameIndex + 1 : 0;
    onFrameChange(newIndex);
  }, [currentFrameIndex, onFrameChange]);

  // Scroll carousel to keep selected frame centred
  useEffect(() => {
    const container = carouselRef.current;
    const selectedButton = frameButtonRefs.current[currentFrameIndex];
    if (!container || !selectedButton) return;

    // Use requestAnimationFrame so DOM is fully painted before measuring
    requestAnimationFrame(() => {
      const containerRect = container.getBoundingClientRect();
      const selectedRect = selectedButton.getBoundingClientRect();
      const offset =
        selectedRect.left - containerRect.left - (containerRect.width / 2 - selectedRect.width / 2);
      container.scrollBy({ left: offset, behavior: 'smooth' });
    });
  }, [currentFrameIndex]);

  // Keyboard navigation (arrow keys)
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

  const renderFramePreview = (frame: Frame, isSelected: boolean, size: 'small' | 'large' = 'small') => {
    const sizeClasses =
      size === 'large' ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-14 h-14 sm:w-16 sm:h-16';

    const baseClasses = `relative transition-all duration-300 ${isSelected
        ? 'ring-2 ring-black scale-110 shadow-xl z-10'
        : 'opacity-60 hover:opacity-80 hover:scale-105 shadow-md'
      }`;

    const photoPreview = photos.find((p) => p !== null) ?? null;

    if (frame.shape === 'heart') {
      return (
        <div className={`${baseClasses} ${sizeClasses}`}>
          <div
            className="w-full h-full flex items-center justify-center rounded-lg"
            style={{ background: frame.backgroundColor }}
          >
            <svg
              viewBox="0 0 100 100"
              className={size === 'large' ? 'w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'}
            >
              <defs>
                <clipPath id={`heart-clip-${frame.id}-${size}`}>
                  <path d="M50 88 C25 65, 5 50, 5 30 C5 15, 20 5, 35 5 C45 5, 50 15, 50 15 C50 15, 55 5, 65 5 C80 5, 95 15, 95 30 C95 50, 75 65, 50 88 Z" />
                </clipPath>
              </defs>
              <path
                d="M50 88 C25 65, 5 50, 5 30 C5 15, 20 5, 35 5 C45 5, 50 15, 50 15 C50 15, 55 5, 65 5 C80 5, 95 15, 95 30 C95 50, 75 65, 50 88 Z"
                fill="none"
                stroke={frame.borderColor}
                strokeWidth={frame.borderWidth}
              />
              {photoPreview ? (
                <image
                  href={photoPreview}
                  x="10" y="10" width="80" height="75"
                  clipPath={`url(#heart-clip-${frame.id}-${size})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <rect
                  x="15" y="15" width="70" height="60"
                  fill="#E5E5E5"
                  clipPath={`url(#heart-clip-${frame.id}-${size})`}
                />
              )}
            </svg>
          </div>
        </div>
      );
    }

    if (frame.shape === 'circle') {
      return (
        <div
          className={`${baseClasses} ${sizeClasses} rounded-full overflow-hidden`}
          style={{
            border: `${Math.min(frame.borderWidth, 3)}px solid ${frame.borderColor}`,
            background: frame.backgroundColor,
          }}
        >
          {photoPreview ? (
            <Image src={photoPreview} alt="Frame preview" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          )}
        </div>
      );
    }

    if (frame.shape === 'polaroid') {
      return (
        <div
          className={`${baseClasses} rounded-sm overflow-hidden`}
          style={{
            background: frame.backgroundColor,
            padding: `${Math.min(frame.borderWidth, 8)}px`,
            paddingBottom: `${Math.min(frame.borderWidth * 2, 16)}px`,
            border: `1px solid ${frame.borderColor}`,
          }}
        >
          <div
            className={`${size === 'large' ? 'w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]' : 'w-10 h-10 sm:w-12 sm:h-12'
              } bg-gray-200 overflow-hidden relative`}
          >
            {photoPreview ? (
              <Image src={photoPreview} alt="Frame preview" fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Default: rectangle
    return (
      <div
        className={`${baseClasses} ${sizeClasses} overflow-hidden rounded-sm relative`}
        style={{
          border: `${Math.min(frame.borderWidth, 4)}px solid ${frame.borderColor}`,
          background: frame.backgroundColor,
        }}
      >
        {photoPreview ? (
          <Image src={photoPreview} alt="Frame preview" fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col overflow-hidden">
      <FloatingNav showBack onBack={onHome} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="pt-14 sm:pt-16 pb-2 text-center shrink-0 px-4">
            <p className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-gray-500 font-semibold">
            Step 2 of 3
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-black mt-1">Choose your frame</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Swipe, tap, or use keyboard ← → to select a style.
          </p>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-3 pb-28 sm:pb-32 overflow-hidden">
          {/* Carousel with prev/next arrows */}
          <div className="relative w-full max-w-md flex items-center justify-center mb-3">
            <button
              type="button"
              id="frame-prev-btn"
              onClick={goToPrevFrame}
              className="absolute left-0 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-colors"
              aria-label="Previous frame style"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div
              ref={carouselRef}
              className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-14 py-4 snap-x snap-mandatory"
              style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
              role="listbox"
              aria-label="Frame styles"
            >
              {FRAMES.map((frame, index) => (
                <button
                  key={frame.id}
                  ref={(node) => { frameButtonRefs.current[index] = node; }}
                  type="button"
                  id={`frame-option-${frame.id}`}
                  onClick={() => onFrameChange(index)}
                  aria-pressed={currentFrameIndex === index}
                  aria-label={`Select ${frame.name} frame`}
                  role="option"
                  aria-selected={currentFrameIndex === index}
                  className="flex flex-col items-center gap-1.5 shrink-0 snap-center transition-all"
                >
                  {renderFramePreview(
                    frame,
                    currentFrameIndex === index,
                    currentFrameIndex === index ? 'large' : 'small'
                  )}
                  <span
                    className={`text-[10px] sm:text-xs font-medium transition-all ${currentFrameIndex === index ? 'text-black scale-105' : 'text-gray-400'
                       }`}
                  >
                    {frame.name}
                  </span>
                </button>
              ))}
            </div>

            <button
              type="button"
              id="frame-next-btn"
              onClick={goToNextFrame}
              className="absolute right-0 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white active:scale-95 transition-colors"
              aria-label="Next frame style"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Dot indicators */}
          <div className="flex gap-1.5 mb-3" role="tablist" aria-label="Frame pages">
            {FRAMES.map((frame, index) => (
              <button
                key={frame.id}
                type="button"
                id={`frame-dot-${index}`}
                onClick={() => onFrameChange(index)}
                aria-label={`Go to frame ${frame.name}`}
                aria-pressed={currentFrameIndex === index}
                className={`h-2 rounded-full transition-all ${currentFrameIndex === index
                    ? 'bg-black w-4'
                    : 'bg-gray-300 hover:bg-gray-400 w-2'
                  }`}
              />
            ))}
          </div>

          {/* Strip mini-preview */}
          <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-gray-500">
                Preview: <span className="font-medium text-gray-700">{selectedFrame.name}</span>
            </p>
            <div
              className="p-2 rounded-lg shadow-lg transition-all duration-300"
              style={{
                background: selectedFrame.backgroundColor,
                border:
                   selectedFrame.shape !== 'polaroid'
                     ? `${Math.max(1, selectedFrame.borderWidth)}px solid ${selectedFrame.borderColor}`
                     : 'none',
              }}
            >
              <div className="flex flex-col gap-0.5" style={{ width: '90px' }}>
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
                    <div key={i} className="w-full">
                      <div
                        className={isPolaroid ? 'w-full' : ''}
                        style={
                          isPolaroid
                            ? {
                              background: selectedFrame.backgroundColor,
                              border: `1px solid ${selectedFrame.borderColor}`,
                              borderRadius: '2px',
                              padding: `${Math.min(selectedFrame.borderWidth, 6)}px`,
                              paddingBottom: `${Math.min(Math.round(selectedFrame.borderWidth * 1.6), 12)}px`,
                            }
                            : undefined
                        }
                      >
                        <div
                          className="relative bg-gray-100 overflow-hidden"
                          style={{ aspectRatio: '1/1', ...shapeStyle }}
                        >
                          {photo ? (
                            <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="text-xs">{i + 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[6px] text-center text-gray-400 mt-1 tracking-wider">
                snapmemories by sagar
              </p>
            </div>
              <p className="text-[10px] text-gray-500 text-center">
              Downloaded strip will match this crop and shape.
            </p>
          </div>
        </div>
      </main>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-2.5 pb-3 safe-bottom bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-sm border-t border-black/5">
        <button
          type="button"
          id="frame-continue-btn"
          onClick={onSelectFrame}
          disabled={!hasAnyPhoto}
          className="w-full max-w-md mx-auto block px-8 sm:px-10 py-3 sm:py-3.5 bg-black text-white text-sm sm:text-base font-bold rounded-full hover:bg-gray-800 active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label={hasAnyPhoto ? `Continue with ${selectedFrame.name} frame` : 'No photos available'}
          title={hasAnyPhoto ? 'Continue to filters' : 'No photos to continue with'}
        >
          Continue to filters →
        </button>
        {!hasAnyPhoto && (
            <p className="text-center text-xs text-gray-600 mt-1.5">
            No photos found. Please go back and capture or upload photos.
          </p>
        )}
      </div>
    </div>
  );
}
