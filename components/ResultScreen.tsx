'use client';

import Image from 'next/image';

interface ResultScreenProps {
  photos: (string | null)[];
  showPrinting: boolean;
  showFinalKiosk: boolean;
  currentFilter: string;
  onFilterClick: (filter: string, el: HTMLButtonElement) => void;
  onDownload: () => void;
  onRetake: () => void;
  onHome: () => void;
  onImageClick: (src: string) => void;
}

export default function ResultScreen({
  photos,
  showPrinting,
  showFinalKiosk,
  currentFilter,
  onFilterClick,
  onDownload,
  onRetake,
  onHome,
  onImageClick,
}: ResultScreenProps) {
  return (
    <div className="w-screen h-screen bg-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-border bg-white flex-shrink-0 w-full">
        <h1
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111',
          }}
        >
          Ready! 🎉
        </h1>
        <div className="flex gap-2">
          <button
            onClick={onDownload}
            className="px-4 py-2 text-sm bg-accent text-white rounded hover:opacity-90 transition-opacity font-bold"
          >
            Download
          </button>
          <button
            onClick={onRetake}
            className="px-4 py-2 text-sm bg-white border-2 border-ink rounded text-ink hover:bg-black/5 transition-colors font-bold"
          >
            Retake
          </button>
          <button
            onClick={onHome}
            className="px-4 py-2 text-sm bg-ink text-bg rounded hover:opacity-90 transition-opacity font-bold"
          >
            Home
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6 overflow-hidden">
        {/* Filter Chips - only show if not printing */}
        {!showPrinting && (
          <div className="flex flex-wrap justify-center gap-2">
            {['Original', 'B&W', 'Warm', 'Cool', 'Vintage', 'Bold'].map((label, i) => (
              <button
                key={i}
                onClick={(e) =>
                  onFilterClick(
                    ['none', 'bw', 'warm', 'cool', 'vintage', 'bold'][i],
                    e.currentTarget
                  )
                }
                className={`px-3 py-1 border-2 border-ink rounded-full text-sm cursor-pointer transition-all duration-150 ${currentFilter === ['none', 'bw', 'warm', 'cool', 'vintage', 'bold'][i]
                    ? 'bg-ink text-white'
                    : 'bg-transparent text-ink hover:bg-black/5'
                  }`}
                style={{
                  fontFamily: "'Caveat', cursive",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Printing Box */}
        {showPrinting && (
          <div className="flex flex-col items-center gap-2 animate-pulse">
            <svg width="110" height="80" viewBox="0 0 110 80" fill="none">
              <rect x="5" y="5" width="100" height="50" rx="6" fill="#fff" stroke="#111" strokeWidth="3" />
              <rect x="15" y="15" width="80" height="30" rx="3" fill="#eee" stroke="#ccc" strokeWidth="1.5" />
              <rect x="35" y="48" width="40" height="28" rx="2" fill="#fff" stroke="#111" strokeWidth="2">
                <animate attributeName="height" values="0;28" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="y" values="52;48" dur="1.5s" repeatCount="indefinite" />
              </rect>
            </svg>
            <p className="text-ink2" style={{ fontFamily: "'Patrick Hand', cursive", animation: 'dots 1.2s infinite' }}>
              Printing...
            </p>
          </div>
        )}

        {/* Final Kiosk Strip */}
        {showFinalKiosk && (
          <div
            className="bg-white border-4 border-ink rounded-lg p-2 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={(e) => {
              const img = (e.target as HTMLImageElement).src;
              if (img && !img.startsWith('data:text')) onImageClick(img);
            }}
          >
            <div
              className="grid grid-cols-2 gap-1 border-4 border-ink rounded overflow-hidden bg-ink"
              style={{ width: '100%', maxWidth: '280px', aspectRatio: '4/3.2' }}
            >
              {photos.map((photo, i) => (
                <div key={i} className="overflow-hidden bg-gray-800 relative">
                  {photo ? (
                    <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover cursor-pointer" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 text-xs" style={{ fontFamily: "'Patrick Hand', cursive" }}>
                      No image
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-xs text-gray-500 mt-2" style={{ fontFamily: "'Patrick Hand', cursive" }}>
              © mysketchbooth
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
