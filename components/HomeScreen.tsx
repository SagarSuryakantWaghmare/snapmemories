'use client';

import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-white to-gray-50 flex flex-col items-center justify-center overflow-hidden p-4 relative">
      {/* Main Content */}
      <div className="max-w-md w-full px-4 text-center flex flex-col items-center">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight">
          Photo Booth
        </h1>
        
        {/* Subtitle */}
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          Capture 4 perfect moments
        </p>

        {/* Icon/Illustration */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          <svg
            viewBox="0 0 120 120"
            className="text-black w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24"
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
          className="px-8 sm:px-10 py-3 sm:py-4 bg-black text-white text-sm sm:text-base font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-xl"
        >
          Start Photo Booth
        </button>

        {/* Instructions */}
        <p className="mt-4 sm:mt-6 text-xs text-gray-500">
          Click to begin • Takes 4 photos • Download your strip
        </p>
      </div>

      {/* Bottom Branding */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-[10px] text-gray-400 tracking-wider">
          snapmemoriesbysagar
        </p>
      </div>
    </div>
  );
}
