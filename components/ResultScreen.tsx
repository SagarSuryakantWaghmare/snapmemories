'use client';

interface ResultScreenProps {
  photos: (string | null)[];
  showPrinting: boolean;
  showFinalKiosk: boolean;
  showActionRow: boolean;
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
  showActionRow,
  currentFilter,
  onFilterClick,
  onDownload,
  onRetake,
  onHome,
  onImageClick,
}: ResultScreenProps) {
  return (
    <div className="screen-active min-h-screen w-full bg-bg flex flex-col items-center px-4 md:px-8 py-6 gap-6">
      {/* Title */}
      <h1 className="font-caveat text-4xl md:text-5xl font-bold text-ink text-center">
        Your Photos are Ready! 🎉
      </h1>

      {/* Filter Chips */}
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
            className={`px-4 py-2 border-2.5 border-ink rounded-full font-caveat text-base cursor-pointer transition-all duration-150 ${
              currentFilter === ['none', 'bw', 'warm', 'cool', 'vintage', 'bold'][i]
                ? 'bg-ink text-white'
                : 'bg-transparent text-ink hover:bg-black/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

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
          <p className="font-patrick text-base text-ink2" style={{ animation: 'dots 1.2s infinite' }}>
            Printing your strip...
          </p>
        </div>
      )}

      {/* Final Kiosk Strip */}
      {showFinalKiosk && (
        <div
          className="bg-white border-4 border-ink rounded-2xl p-2.5 shadow-2xl cursor-pointer transition-transform duration-200 hover:-rotate-1 hover:scale-105"
          onClick={(e) => {
            const img = (e.target as HTMLImageElement).src;
            if (img && !img.startsWith('data:text')) onImageClick(img);
          }}
        >
          <div
            className="grid grid-cols-2 gap-1 border-4 border-ink rounded-lg overflow-hidden bg-ink"
            style={{ aspectRatio: '4/3.2' }}
          >
            {photos.map((photo, i) => (
              <div key={i} className="overflow-hidden bg-gray-800">
                {photo ? (
                  <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover cursor-pointer" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-500 font-patrick text-xs">
                    No image
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center font-patrick text-xs text-gray-500 mt-2 tracking-wider">
            © 2025 Sagar Suryakant Waghmare · mysketchbooth
          </div>
        </div>
      )}

      {/* Action Buttons Row */}
      {showActionRow && (
        <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center">
          {/* Download */}
          <button
            onClick={onDownload}
            className="flex items-center gap-2 px-6 py-3 font-caveat text-lg font-bold bg-ink text-white border-4 border-ink rounded-lg cursor-pointer shadow-lg transition-all duration-100 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-px active:shadow-md"
            style={{
              boxShadow: '3px 3px 0 #111111',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download
          </button>

          {/* Retake */}
          <button
            onClick={onRetake}
            className="flex items-center gap-2 px-6 py-3 font-caveat text-lg font-bold bg-white text-ink border-4 border-ink rounded-lg cursor-pointer shadow-lg transition-all duration-100 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-px active:shadow-md"
            style={{
              boxShadow: '3px 3px 0 #111111',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 .49-3.5" />
            </svg>
            Retake
          </button>

          {/* Home */}
          <button
            onClick={onHome}
            className="flex items-center gap-2 px-6 py-3 font-caveat text-lg font-bold bg-white text-ink border-4 border-ink rounded-lg cursor-pointer shadow-lg transition-all duration-100 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-px active:shadow-md"
            style={{
              boxShadow: '3px 3px 0 #111111',
            }}
          >
            Home
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center font-patrick text-xs text-gray-400 mt-6">
        © 2025 Sagar Suryakant Waghmare. All rights reserved.
      </footer>
    </div>
  );
}
