'use client';

import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center overflow-hidden p-4">
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
          className="px-8 md:px-12 py-3 md:py-4 bg-black text-white text-base md:text-lg font-semibold rounded-lg 
                     hover:bg-gray-800 active:bg-gray-900 
                     transition-all duration-150 
                     shadow-lg hover:shadow-xl
                     transform hover:-translate-y-0.5"
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
