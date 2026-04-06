'use client';

interface FloatingNavProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function FloatingNav({ onBack, showBack = false }: FloatingNavProps) {
  return (
    <div className="fixed top-3 left-3 z-50">
      {/* Back/Home Button */}
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full 
                     bg-black/70 backdrop-blur-sm text-white
                     hover:bg-black/90 active:scale-95
                     transition-all duration-150 shadow-lg
                     flex items-center justify-center"
          aria-label="Go Back"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
