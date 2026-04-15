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
        className="h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-white/30 bg-black/75 text-white backdrop-blur-md shadow-lg hover:bg-black/90 active:scale-95 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white/50"
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
