'use client';

import { Check, Sparkles, Download, Camera, ArrowRight } from 'lucide-react';
import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <main className="w-full h-full min-h-screen bg-gradient-to-br from-white via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex flex-col items-center justify-center overflow-hidden p-4 relative">
      <section className="w-full max-w-md rounded-3xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-gray-800/90 backdrop-blur p-5 sm:p-6 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 dark:text-gray-400 mb-2">
          snapmemories
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight">
          Photo Booth
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 mb-4">
          Capture four moments and leave with a polished photo strip.
        </p>

        <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-gray-700 shadow-sm">
          <svg viewBox="0 0 120 120" className="text-black dark:text-white w-12 h-12 sm:w-14 sm:h-14" aria-hidden="true">
            <rect x="20" y="40" width="80" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="12" fill="currentColor" opacity="0.12" />
            <circle cx="85" cy="55" r="5" fill="currentColor" />
            <rect x="45" y="28" width="30" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="mb-4 flex flex-wrap justify-center gap-2 text-[11px] sm:text-xs text-gray-700 dark:text-gray-200">
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 inline-flex items-center gap-1.5">
            <Check className="w-3 h-3" /> 4 auto shots
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 inline-flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" /> Live filters
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-1 inline-flex items-center gap-1.5">
            <Download className="w-3 h-3" /> Instant download
          </span>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="w-full px-8 sm:px-10 py-3 sm:py-3.5 bg-blue-600 dark:bg-blue-700 text-white text-sm sm:text-base font-bold rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 active:scale-[0.98] shadow-xl inline-flex items-center justify-center gap-2 transition-colors min-h-12"
          aria-label="Start the photo booth application"
          title="Start capturing photos"
        >
          Start Photo Booth
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 inline-flex items-center justify-center gap-1">
          <Camera className="w-3 h-3" /> Camera or upload • 4 automatic shots • instant download
        </p>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 text-center safe-bottom">
        <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wider">snapmemories by sagar</p>
      </footer>
    </main>
  );
}
