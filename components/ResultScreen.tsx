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
    <div className="w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack onBack={onHome} />

      {/* Floating Action Buttons - Top Right */}
      {showFinalKiosk && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={onDownload}
            className="px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-bold bg-black text-white rounded-full 
                       hover:bg-gray-800 active:scale-95 transition-all shadow-lg
                       flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2.5 md:px-5 md:py-3 text-sm md:text-base font-bold 
                       bg-white/90 backdrop-blur-sm text-black border-2 border-black/20 rounded-full 
                       hover:bg-white active:scale-95 transition-all shadow-lg
                       flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Retake
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-6 overflow-auto">
        {/* Printing Animation */}
        {showPrinting && (
          <div className="flex flex-col items-center gap-4">
            <svg width="80" height="80" viewBox="0 0 100 100" className="animate-pulse">
              <rect x="10" y="30" width="80" height="50" rx="5" fill="none" stroke="#111" strokeWidth="2" />
              <rect x="20" y="40" width="60" height="30" rx="3" fill="#F3F4F6" />
              <rect x="30" y="60" width="40" height="20" fill="#111">
                <animate attributeName="height" values="0;20" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="80;60" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </svg>
            <p className="text-base md:text-lg font-medium text-gray-600">Processing your photos...</p>
          </div>
        )}

        {/* Final Result */}
        {showFinalKiosk && (
          <>
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-black">Your Photos</h1>

            {/* Filter Options */}
            <div className="flex flex-wrap gap-2 justify-center max-w-full px-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full font-medium transition-all text-sm md:text-base ${
                    currentFilter === filter.value
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-white text-black hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Photo Strip */}
            <div
              className="bg-white border-3 border-black rounded-lg p-2 md:p-3 shadow-xl cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG') {
                  const src = (target as HTMLImageElement).src;
                  if (src && !src.includes('data:text')) {
                    onImageClick(src);
                  }
                }
              }}
              style={{ width: '200px', maxWidth: '85vw' }}
            >
              <div className="flex flex-col gap-1">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-100 border-2 border-gray-300 rounded overflow-hidden"
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
                        <span className="text-2xl">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-400 mt-2">Tap photos to enlarge</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
