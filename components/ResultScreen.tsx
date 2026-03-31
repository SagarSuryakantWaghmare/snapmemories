'use client';

import { ResultScreenProps } from '@/lib/types';
import { FILTERS } from '@/lib/constants';

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
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 shrink-0">
        <h1 className="text-xl font-bold text-black">Your Photos</h1>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="px-4 py-2 text-sm font-semibold bg-black text-white rounded hover:bg-gray-800 transition-colors"
          >
            Download
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2 text-sm font-semibold border-2 border-black text-black rounded hover:bg-gray-100 transition-colors"
          >
            Retake
          </button>
          <button
            onClick={onHome}
            className="px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded transition-colors"
          >
            Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-6 overflow-auto max-h-[calc(100vh-4rem)]">
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
            {/* Filter Options */}
            <div className="flex flex-wrap gap-2 justify-center max-w-full px-2">
              {FILTERS.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => onFilterChange(filter.value)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                    currentFilter === filter.value
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {filter.name}
                </button>
              ))}
            </div>

            {/* Photo Strip */}
            <div
              className="bg-white border-3 border-black rounded-lg p-2 md:p-3 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
              onClick={(e) => {
                const target = e.target as HTMLElement;
                if (target.tagName === 'IMG') {
                  const src = (target as HTMLImageElement).src;
                  if (src && !src.includes('data:text')) {
                    onImageClick(src);
                  }
                }
              }}
              style={{ width: '180px', maxWidth: '85vw' }}
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
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-2xl">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">Click photos to enlarge</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
