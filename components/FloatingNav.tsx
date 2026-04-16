'use client';

interface FloatingNavProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function FloatingNav({ onBack, showBack = false }: FloatingNavProps) {
  if (!showBack || !onBack) return null;

  return (
    <div className="fixed top-0 left-0 z-50 p-3 sm:p-4 safe-top">
      <button
        type="button"
        onClick={onBack}
        className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-blue-200 bg-blue-50 text-blue-600 backdrop-blur-md shadow-lg hover:bg-blue-100 active:scale-95 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label="Go back to home screen"
        title="Back to home"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
