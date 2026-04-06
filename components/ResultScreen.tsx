'use client';

import { ResultScreenProps } from '@/lib/types';
import { FILTERS } from '@/lib/constants';
import FloatingNav from './FloatingNav';

export default function ResultScreen({
  photos,
  showPrinting,
  showFinalKiosk,
  currentFilter,
  onFilterChange,
  onDownload,
  onRetake,
  onHome,
  onImageClick,
}: ResultScreenProps) {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack onBack={onHome} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-4 pt-16 pb-20 overflow-auto">
        {/* Printing Animation */}
        {showPrinting && (
          <div className="flex flex-col items-center gap-3">
            <svg width="64" height="64" viewBox="0 0 100 100" className="animate-pulse">
              <rect x="10" y="30" width="80" height="50" rx="5" fill="none" stroke="#111" strokeWidth="2" />
              <rect x="20" y="40" width="60" height="30" rx="3" fill="#F3F4F6" />
              <rect x="30" y="60" width="40" height="20" fill="#111">
                <animate attributeName="height" values="0;20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="80;60" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </svg>
            <p className="text-sm sm:text-base font-medium text-gray-600">Processing your photos...</p>
          </div>
        )}

        {/* Final Result */}
        {showFinalKiosk && (
          <>
            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-bold text-black">Your Photos</h1>

            {/* Filter Options - Professional Pills */}
            <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center max-w-sm px-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium transition-all text-xs sm:text-sm ${
                    currentFilter === filter.value
                      ? 'bg-black text-white shadow-md'
                      : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Photo Strip */}
            <div
              className="bg-white border-2 border-black rounded-lg p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG') {
                  const src = (target as HTMLImageElement).src;
                  if (src && !src.includes('data:text')) {
                    onImageClick(src);
                  }
                }
              }}
              style={{ width: 'min(160px, 45vw)' }}
            >
              <div className="flex flex-col gap-1">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
                    style={{ width: '100%', aspectRatio: '1/1' }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-lg">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              {/* Branding inside the frame */}
              <p className="text-[8px] sm:text-[9px] text-center text-gray-400 mt-1.5 tracking-wider">
                snapmemoriesbysagar
              </p>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-400">Tap photos to enlarge</p>

            {/* Action Buttons - Fixed at bottom */}
            <div className="fixed bottom-4 left-0 right-0 flex justify-center gap-2 px-4 z-50">
              <button
                onClick={onRetake}
                className="px-4 py-2.5 text-xs sm:text-sm font-bold 
                           bg-white/95 backdrop-blur-sm text-black border border-black/20 rounded-full 
                           hover:bg-white active:scale-95 transition-all shadow-lg
                           flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Retake
              </button>
              <button
                onClick={onDownload}
                className="px-5 py-2.5 text-xs sm:text-sm font-bold bg-black text-white rounded-full 
                           hover:bg-gray-800 active:scale-95 transition-all shadow-lg
                           flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
