'use client';

import { useRef, useEffect } from 'react';
import { FrameSelectionProps, Frame } from '@/lib/types';
import { FRAMES } from '@/lib/constants';
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

  // Scroll carousel to center the selected frame
  useEffect(() => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const itemWidth = 100; // approximate width of each item
      const containerWidth = container.offsetWidth;
      const scrollPosition = currentFrameIndex * itemWidth - (containerWidth / 2) + (itemWidth / 2);
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [currentFrameIndex]);

  // Navigate carousel
  const goToPrevFrame = () => {
    const newIndex = currentFrameIndex > 0 ? currentFrameIndex - 1 : FRAMES.length - 1;
    onFrameChange(newIndex);
  };

  const goToNextFrame = () => {
    const newIndex = currentFrameIndex < FRAMES.length - 1 ? currentFrameIndex + 1 : 0;
    onFrameChange(newIndex);
  };

  // Render frame preview based on shape
  const renderFramePreview = (frame: Frame, isSelected: boolean, size: 'small' | 'large' = 'small') => {
    const sizeClasses = size === 'large' 
      ? 'w-20 h-20 sm:w-24 sm:h-24' 
      : 'w-14 h-14 sm:w-16 sm:h-16';
    
    const baseClasses = `relative transition-all duration-300 ${
      isSelected 
        ? 'ring-2 ring-black scale-110 shadow-xl z-10' 
        : 'opacity-60 hover:opacity-80 hover:scale-105 shadow-md'
    }`;

    const photoPreview = photos[0] || null;

    // Heart shape
    if (frame.shape === 'heart') {
      return (
        <div className={`${baseClasses} ${sizeClasses}`}>
          <div 
            className="w-full h-full flex items-center justify-center rounded-lg"
            style={{ background: frame.backgroundColor }}
          >
            <svg viewBox="0 0 100 100" className={size === 'large' ? 'w-18 h-18 sm:w-20 sm:h-20' : 'w-12 h-12 sm:w-14 sm:h-14'}>
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
                <rect x="15" y="15" width="70" height="60" fill="#E5E5E5" clipPath={`url(#heart-clip-${frame.id}-${size})`} />
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
          className={`${baseClasses} ${sizeClasses} rounded-full overflow-hidden`}
          style={{ 
            border: `${Math.min(frame.borderWidth, 3)}px solid ${frame.borderColor}`,
            background: frame.backgroundColor 
          }}
        >
          {photoPreview ? (
            <Image src={photoPreview} alt="Preview" fill className="object-cover" />
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
          <div className={`${size === 'large' ? 'w-16 h-16 sm:w-18 sm:h-18' : 'w-10 h-10 sm:w-12 sm:h-12'} bg-gray-200 overflow-hidden`}>
            {photoPreview ? (
              <Image src={photoPreview} alt="Preview" fill className="object-cover" />
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
        className={`${baseClasses} ${sizeClasses} overflow-hidden rounded-sm`}
        style={{ 
          border: `${Math.min(frame.borderWidth, 4)}px solid ${frame.borderColor}`,
          background: frame.backgroundColor,
        }}
      >
        {photoPreview ? (
          <Image src={photoPreview} alt="Preview" fill className="object-cover" />
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
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Swipe or tap to select a style</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 pb-24 overflow-hidden">
        
        {/* Carousel Container */}
        <div className="relative w-full max-w-md flex items-center justify-center mb-4">
          {/* Previous Button */}
          <button
            onClick={goToPrevFrame}
            className="absolute left-0 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                       bg-white/90 backdrop-blur-sm shadow-lg
                       flex items-center justify-center
                       hover:bg-white active:scale-95 transition-all"
            aria-label="Previous frame"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Carousel */}
          <div 
            ref={carouselRef}
            className="flex items-center gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-14 py-4 snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
          >
            {FRAMES.map((frame, index) => (
              <button
                key={frame.id}
                onClick={() => onFrameChange(index)}
                className="flex flex-col items-center gap-1.5 shrink-0 snap-center transition-all"
              >
                {renderFramePreview(frame, currentFrameIndex === index, currentFrameIndex === index ? 'large' : 'small')}
                <span className={`text-[10px] sm:text-xs font-medium transition-all ${
                  currentFrameIndex === index ? 'text-black scale-105' : 'text-gray-400'
                }`}>
                  {frame.name}
                </span>
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={goToNextFrame}
            className="absolute right-0 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                       bg-white/90 backdrop-blur-sm shadow-lg
                       flex items-center justify-center
                       hover:bg-white active:scale-95 transition-all"
            aria-label="Next frame"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Frame indicator dots */}
        <div className="flex gap-1.5 mb-4">
          {FRAMES.map((_, index) => (
            <button
              key={index}
              onClick={() => onFrameChange(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentFrameIndex === index 
                  ? 'bg-black w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to frame ${index + 1}`}
            />
          ))}
        </div>

        {/* Selected Frame Full Preview with All Photos */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-gray-500">Preview with your photos:</p>
          <div 
            className="p-2 rounded-lg shadow-lg transition-all duration-300"
            style={{
              background: selectedFrame.backgroundColor,
              border: selectedFrame.shape !== 'polaroid' 
                ? `${Math.min(selectedFrame.borderWidth, 3)}px solid ${selectedFrame.borderColor}` 
                : 'none',
            }}
          >
            <div className="flex flex-col gap-0.5" style={{ width: '90px' }}>
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
                    <Image src={photo} alt={`Photo ${i + 1}`} fill className="object-cover" />
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
              snapmemories by sagar
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
