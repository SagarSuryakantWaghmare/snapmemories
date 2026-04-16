'use client';

import Image from 'next/image';
import { ResultScreenProps } from '@/lib/types';
import { FILTERS } from '@/lib/constants';
import { HEART_CLIP_POLYGON } from '@/lib/frame-shapes';
import FloatingNav from './FloatingNav';

export default function ResultScreen({
  photos,
  showPrinting,
  showFinalKiosk,
  selectedFrame,
  currentFilter,
  onFilterChange,
  onDownload,
  onRetake,
  onHome,
  onImageClick,
}: ResultScreenProps) {
  const hasAnyPhoto = photos.some((photo) => photo !== null);
  const framePreviewBorderWidth = Math.min(selectedFrame.borderWidth, 6);

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col overflow-hidden">
      <FloatingNav showBack onBack={onHome} />

      <main className="flex-1 flex flex-col items-center justify-start sm:justify-center gap-3 p-4 pt-14 sm:pt-16 pb-28 sm:pb-32 overflow-auto">
        {showPrinting && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-black/10 bg-white px-6 py-5 shadow-md">
            <svg width="64" height="64" viewBox="0 0 100 100" className="animate-pulse" aria-hidden>
              <rect x="10" y="30" width="80" height="50" rx="5" fill="none" stroke="#111" strokeWidth="2" />
              <rect x="20" y="40" width="60" height="30" rx="3" fill="#F3F4F6" />
              <rect x="30" y="60" width="40" height="20" fill="#111">
                <animate attributeName="height" values="0;20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="80;60" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </svg>
            <p className="text-sm sm:text-base font-medium text-gray-700">Processing your photos...</p>
          </div>
        )}

        {showFinalKiosk && (
          <>
            <header className="text-center">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-gray-500 font-semibold">Step 3 of 3</p>
              <h1 className="text-xl sm:text-2xl font-bold text-black mt-1">Your photo strip is ready</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Frame: <span className="font-medium text-gray-700">{selectedFrame.name}</span> • Tap any filled photo to preview it larger.
              </p>
            </header>

            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-sm px-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => onFilterChange(filter.value)}
                  aria-pressed={currentFilter === filter.value}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-all text-xs sm:text-sm min-h-10 ${
                    currentFilter === filter.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white/85 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                  title={`Apply ${filter.name} filter`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            <div
              className="rounded-lg p-2 shadow-lg transition-colors"
              style={{
                width: 'min(190px, 52vw)',
                background: selectedFrame.backgroundColor,
                border:
                  selectedFrame.shape === 'polaroid'
                    ? `1px solid ${selectedFrame.borderColor}`
                    : `${framePreviewBorderWidth}px solid ${selectedFrame.borderColor}`,
              }}
            >
              <div className="flex flex-col gap-1">
                {photos.map((photo, i) => {
                  const isPolaroid = selectedFrame.shape === 'polaroid';
                  const mediaStyle =
                    selectedFrame.shape === 'heart'
                      ? {
                          clipPath: HEART_CLIP_POLYGON,
                          border: `${Math.max(2, Math.min(selectedFrame.borderWidth, 4))}px solid ${selectedFrame.borderColor}`,
                        }
                      : selectedFrame.shape === 'circle'
                        ? {
                            borderRadius: '50%',
                            border: `${Math.max(2, Math.min(selectedFrame.borderWidth, 4))}px solid ${selectedFrame.borderColor}`,
                          }
                        : {
                            borderRadius: '2px',
                            border:
                              selectedFrame.shape === 'rectangle'
                                ? `${Math.max(2, Math.min(selectedFrame.borderWidth, 4))}px solid ${selectedFrame.borderColor}`
                                : '1px solid #E5E7EB',
                          };

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => photo && onImageClick(photo)}
                      disabled={!photo}
                      aria-label={photo ? `Preview photo ${i + 1}` : `Photo slot ${i + 1} is empty`}
                      className="w-full bg-transparent p-0 text-left disabled:cursor-default"
                    >
                      <div
                        style={
                          isPolaroid
                            ? {
                                background: selectedFrame.backgroundColor,
                                border: `1px solid ${selectedFrame.borderColor}`,
                                borderRadius: '2px',
                                padding: `${Math.min(selectedFrame.borderWidth, 8)}px`,
                                paddingBottom: `${Math.min(Math.round(selectedFrame.borderWidth * 1.6), 16)}px`,
                              }
                            : undefined
                        }
                      >
                        <div
                          className="relative w-full bg-gray-100 overflow-hidden aspect-square"
                          style={mediaStyle}
                        >
                          {photo ? (
                            <>
                              <Image
                                src={photo}
                                alt={`Photo ${i + 1}`}
                                fill
                                className="object-cover hover:opacity-90"
                              />
                              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-white">
                                Zoom
                              </span>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <span className="text-lg">{i + 1}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-[8px] sm:text-[9px] text-center text-gray-400 mt-1.5 tracking-wider">
                snapmemories by sagar
              </p>
            </div>

            {!hasAnyPhoto && <p className="text-xs text-red-600">No photos available yet. Retake to capture again.</p>}
          </>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-2.5 pb-3 safe-bottom bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-sm border-t border-black/5">
        <div className="mx-auto flex max-w-md gap-2">
          <button
            type="button"
            onClick={onRetake}
            className="flex-1 px-4 py-3 sm:py-3.5 text-sm font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-full hover:bg-blue-100 active:scale-[0.98] shadow transition-colors min-h-11"
            aria-label="Retake photos with new captures"
            title="Go back and capture new photos"
          >
            Retake
          </button>
          <button
            type="button"
            onClick={onDownload}
            disabled={!hasAnyPhoto}
            className="flex-1 px-4 py-3 sm:py-3.5 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 active:scale-[0.98] shadow disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-11"
            aria-label={hasAnyPhoto ? 'Download your photo strip' : 'Download disabled - no photos available'}
            title={hasAnyPhoto ? 'Download as image' : 'No photos to download'}
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
