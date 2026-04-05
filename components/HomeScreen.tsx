'use client';

import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center overflow-hidden p-4 relative">
      {/* Floating Logo - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/80 backdrop-blur-sm 
                        flex items-center justify-center shadow-lg">
          <svg className="w-7 h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
      </div>

      <div className="max-w-2xl w-full px-4 md:px-6 text-center flex flex-col items-center">

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-3 md:mb-4 tracking-tight">
          Photo Booth
        </h1>
        
        {/* Subtitle */}
        <p className="text-base md:text-lg lg:text-xl text-gray-600 mb-8 md:mb-12">
          Capture 4 perfect moments
        </p>

        {/* Icon/Illustration */}
        <div className="mb-8 md:mb-12 flex justify-center">
          <svg
            width="100"
            height="100"
            viewBox="0 0 120 120"
            className="text-black w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
          >
            {/* Camera body */}
            <rect
              x="20"
              y="40"
              width="80"
              height="60"
              rx="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            {/* Lens */}
            <circle
              cx="60"
              cy="70"
              r="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <circle cx="60" cy="70" r="12" fill="currentColor" opacity="0.1" />
            {/* Flash */}
            <circle cx="85" cy="55" r="5" fill="currentColor" />
            {/* Viewfinder */}
            <rect
              x="45"
              y="28"
              width="30"
              height="8"
              rx="2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="px-10 md:px-14 py-4 md:py-5 bg-black text-white text-base md:text-lg font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-2xl hover:shadow-3xl"
        >
          Start Photo Booth
        </button>

        {/* Instructions */}
        <p className="mt-6 md:mt-8 text-xs md:text-sm text-gray-500">
          Click to begin • Takes 4 photos • Download your strip
        </p>
      </div>
    </div>
  );
}
