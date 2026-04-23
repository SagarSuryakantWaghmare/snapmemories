'use client';

import { Check, Sparkles, Download, Camera, ArrowRight } from 'lucide-react';
import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <main className="w-full h-full min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black flex flex-col items-center justify-center overflow-hidden p-4 relative">
      <section className="w-full max-w-md rounded-3xl border border-black/15 dark:border-white/15 bg-white/95 dark:bg-gray-800/95 backdrop-blur p-5 sm:p-6 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-fade-in-up">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 dark:text-gray-400 mb-2 opacity-75 hover:opacity-100 transition-opacity">
          snapmemories
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white tracking-tight leading-tight">
          Photo Booth
        </h1>

        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-3 mb-6 leading-relaxed">
          Capture four moments and leave with a polished photo strip.
        </p>

        <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-black/15 dark:border-white/15 bg-gradient-to-br from-white to-gray-50 dark:from-gray-700 dark:to-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group animate-scale-in">
          <svg viewBox="0 0 120 120" className="text-black dark:text-white w-12 h-12 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform duration-300" aria-hidden="true">
            <rect x="20" y="40" width="80" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="12" fill="currentColor" opacity="0.12" />
            <circle cx="85" cy="55" r="5" fill="currentColor" />
            <rect x="45" y="28" width="30" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="mb-6 flex flex-wrap justify-center gap-2.5 text-[11px] sm:text-xs text-gray-700 dark:text-gray-300">
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 inline-flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm animate-fade-in" style={{ animationDelay: '100ms' }}>
            <Check className="w-3 h-3" /> 4 auto shots
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 inline-flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm animate-fade-in" style={{ animationDelay: '150ms' }}>
            <Sparkles className="w-3 h-3" /> Live filters
          </span>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-3 py-1.5 inline-flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Download className="w-3 h-3" /> Instant download
          </span>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="w-full px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black text-sm sm:text-base font-bold rounded-full hover:shadow-button-hover active:scale-[0.98] shadow-xl inline-flex items-center justify-center gap-2 transition-all duration-200 min-h-12 group relative overflow-hidden"
          aria-label="Start the photo booth application"
          title="Start capturing photos"
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            Start Photo Booth
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black dark:from-gray-300 dark:to-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </button>

        <p className="mt-5 text-xs text-gray-500 dark:text-gray-400 inline-flex items-center justify-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <Camera className="w-3 h-3" /> Camera or upload • 4 automatic shots • instant download
        </p>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 text-center safe-bottom animate-fade-in" style={{ animationDelay: '400ms' }}>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 tracking-wider hover:text-gray-600 dark:hover:text-gray-400 transition-colors">snapmemories by sagar</p>
      </footer>
    </main>
  );
}
