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
      isSelected ? 'ring-4 ring-black scale-105 shadow-xl' : 'hover:scale-102 shadow-lg'
    }`;

    const photoPreview = photos[0] || null;

    // Heart shape
    if (frame.shape === 'heart') {
      return (
        <div className={`${baseClasses} w-24 h-24 md:w-28 md:h-28`}>
          <div 
            className="w-full h-full flex items-center justify-center"
            style={{ 
              background: frame.backgroundColor,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-24 md:h-24">
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
          className={`${baseClasses} w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden`}
          style={{ 
            border: `${frame.borderWidth}px solid ${frame.borderColor}`,
            background: frame.backgroundColor 
          }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-2xl">📷</span>
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
            padding: `${frame.borderWidth}px`,
            paddingBottom: `${frame.borderWidth * 2.5}px`,
            border: `2px solid ${frame.borderColor}`,
          }}
        >
          <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-200 overflow-hidden">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📷</span>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Rectangle shape (default)
    return (
      <div 
        className={`${baseClasses} w-24 h-24 md:w-28 md:h-28 overflow-hidden`}
        style={{ 
          border: `${frame.borderWidth}px solid ${frame.borderColor}`,
          background: frame.backgroundColor,
        }}
      >
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-2xl">📷</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack onBack={onHome} />

      {/* Title */}
      <div className="pt-8 pb-4 text-center shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Choose Your Frame</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">Select a style for your photos</p>
      </div>

      {/* Frame Grid */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-auto">
        <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-lg w-full">
          {FRAMES.map((frame, index) => (
            <button
              key={frame.id}
              onClick={() => onFrameChange(index)}
              className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-white/50 transition-all"
            >
              {renderFramePreview(frame, currentFrameIndex === index)}
              <span className={`text-xs md:text-sm font-medium ${
                currentFrameIndex === index ? 'text-black' : 'text-gray-600'
              }`}>
                {frame.name}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Frame Preview with All Photos */}
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-gray-500">Preview with all photos:</p>
          <div 
            className="p-3 rounded-lg shadow-xl"
            style={{
              background: selectedFrame.backgroundColor,
              border: selectedFrame.shape !== 'polaroid' 
                ? `${selectedFrame.borderWidth}px solid ${selectedFrame.borderColor}` 
                : 'none',
            }}
          >
            <div className="flex flex-col gap-1" style={{ width: '120px' }}>
              {photos.map((photo, i) => (
                <div
                  key={i}
                  className="relative bg-gray-100 overflow-hidden"
                  style={{ 
                    aspectRatio: '1/1',
                    borderRadius: selectedFrame.shape === 'circle' ? '50%' : 
                                  selectedFrame.shape === 'heart' ? '0' : '4px',
                  }}
                >
                  {photo ? (
                    <img src={photo} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-lg">{i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Continue Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onSelectFrame}
          className="px-10 md:px-14 py-4 md:py-5 bg-black text-white text-base md:text-lg font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-2xl hover:shadow-3xl"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
