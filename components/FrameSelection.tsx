'use client';

import { FrameSelectionProps, Frame } from '@/lib/types';
import { FRAMES } from '@/lib/constants';
import FloatingNav from './FloatingNav';

export default function FrameSelection({
  photos,
  currentFrameIndex,
  onFrameChange,
  onSelectFrame,
  onHome,
}: FrameSelectionProps) {
  const selectedFrame = FRAMES[currentFrameIndex];

  // Render frame preview based on shape
  const renderFramePreview = (frame: Frame, isSelected: boolean) => {
    const baseClasses = `relative transition-all duration-200 ${
      isSelected ? 'ring-2 ring-black scale-105 shadow-lg' : 'hover:scale-102 shadow-md'
    }`;

    const photoPreview = photos[0] || null;

    // Heart shape
    if (frame.shape === 'heart') {
      return (
        <div className={`${baseClasses} w-16 h-16 sm:w-20 sm:h-20`}>
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              background: frame.backgroundColor,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-14 h-14 sm:w-18 sm:h-18">
              <defs>
                <clipPath id={`heart-clip-${frame.id}`}>
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
                  clipPath={`url(#heart-clip-${frame.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              ) : (
                <rect x="15" y="15" width="70" height="60" fill="#E5E5E5" clipPath={`url(#heart-clip-${frame.id})`} />
              )}
            </svg>
          </div>
        </div>
      );
    }

    // Circle shape
    if (frame.shape === 'circle') {
      return (
        <div 
          className={`${baseClasses} w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden`}
          style={{ 
            border: `${Math.min(frame.borderWidth, 3)}px solid ${frame.borderColor}`,
            background: frame.backgroundColor 
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">📷</span>
            </div>
          )}
        </div>
      );
    }

    // Polaroid shape
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
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-200 overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-lg">📷</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Rectangle shape (default)
    return (
      <div 
        className={`${baseClasses} w-16 h-16 sm:w-20 sm:h-20 overflow-hidden`}
        style={{ 
          border: `${Math.min(frame.borderWidth, 4)}px solid ${frame.borderColor}`,
          background: frame.backgroundColor,
        }}
      >
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-lg">📷</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack onBack={onHome} />

      {/* Title */}
      <div className="pt-14 pb-2 text-center shrink-0 px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Choose Your Frame</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Select a style for your photos</p>
      </div>

      {/* Frame Grid */}
      <div className="flex-1 flex flex-col items-center justify-start px-3 pb-24 overflow-auto">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-sm w-full">
          {FRAMES.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => onFrameChange(index)}
              className="flex flex-col items-center gap-1 p-1.5 rounded-lg hover:bg-white/50 transition-all active:scale-95"
            >
              {renderFramePreview(frame, currentFrameIndex === index)}
              <span className={`text-[10px] sm:text-xs font-medium truncate w-full text-center ${
                currentFrameIndex === index ? 'text-black' : 'text-gray-500'
              }`}>
                {frame.name}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Frame Preview with All Photos */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">Preview:</p>
          <div 
            className="p-2 rounded-lg shadow-lg"
            style={{
              background: selectedFrame.backgroundColor,
              border: selectedFrame.shape !== 'polaroid' 
                ? `${Math.min(selectedFrame.borderWidth, 3)}px solid ${selectedFrame.borderColor}` 
                : 'none',
            }}
          >
            <div className="flex flex-col gap-0.5" style={{ width: '80px' }}>
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="relative bg-gray-100 overflow-hidden"
                  style={{ 
                    aspectRatio: '1/1',
                    borderRadius: selectedFrame.shape === 'circle' ? '50%' : 
                                  selectedFrame.shape === 'heart' ? '0' : '2px',
                  }}
                >
                  {photo ? (
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-xs">{i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Branding */}
            <p className="text-[6px] text-center text-gray-400 mt-1 tracking-wider">
              snapmemoriesbysagar
            </p>
          </div>
        </div>
      </div>

      {/* Floating Continue Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onSelectFrame}
          className="px-8 sm:px-10 py-3 sm:py-3.5 bg-black text-white text-sm sm:text-base font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-xl"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
