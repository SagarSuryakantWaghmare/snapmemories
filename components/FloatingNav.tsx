'use client';

interface FloatingNavProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function FloatingNav({ onBack, showBack = false }: FloatingNavProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-3 sm:p-4 safe-top pointer-events-none animate-fade-in">
      {/* Back button */}
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="pointer-events-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-gray-300 bg-white/90 text-gray-800 backdrop-blur-md shadow-lg hover:shadow-button-hover hover:bg-gray-100 active:scale-95 flex items-center justify-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 group"
          aria-label="Go back to home screen"
          title="Back to home"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
