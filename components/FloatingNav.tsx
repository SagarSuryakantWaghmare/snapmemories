'use client';

interface FloatingNavProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function FloatingNav({ onBack, showBack = false }: FloatingNavProps) {
  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2">
      {/* Logo */}
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/80 backdrop-blur-sm 
                      flex items-center justify-center shadow-lg">
        <svg className="w-7 h-7 md:w-8 md:h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
      </div>

      {/* Back Button */}
      {showBack && onBack && (
        <button
          onClick={onBack}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full 
                     bg-white/90 backdrop-blur-sm text-black border-2 border-black/20
                     hover:bg-white active:scale-95
                     transition-all duration-150 shadow-lg
                     flex items-center justify-center"
          aria-label="Go Back"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
