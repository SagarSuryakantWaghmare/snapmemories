'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';

interface FloatingNavProps {
  onBack?: () => void;
  showBack?: boolean;
}

export default function FloatingNav({ onBack, showBack = false }: FloatingNavProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-start justify-between p-3 sm:p-4 safe-top pointer-events-none">
      {/* Back button */}
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="pointer-events-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 backdrop-blur-md shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900/60 active:scale-95 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
          aria-label="Go back to home screen"
          title="Back to home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Theme toggle button */}
      <button
        type="button"
        onClick={toggleTheme}
        className="pointer-events-auto ml-auto h-11 w-11 sm:h-12 sm:w-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 backdrop-blur-md shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95 flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-blue-400"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
