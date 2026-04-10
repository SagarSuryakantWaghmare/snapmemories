'use client';

import { HomeScreenProps } from '@/lib/types';

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  return (
    <main className="w-full h-full min-h-screen bg-gradient-to-br from-white via-white to-gray-100 flex flex-col items-center justify-center overflow-hidden p-4 relative">
      <section className="w-full max-w-md rounded-3xl border border-black/10 bg-white/90 backdrop-blur p-6 sm:p-8 text-center shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
        <p className="text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-3">
          snapmemories
        </p>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight">
          Photo Booth
        </h1>

        <p className="text-sm sm:text-base text-gray-600 mt-2 mb-6">
          Capture four moments and leave with a polished photo strip.
        </p>

        <div className="mx-auto mb-6 flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl border border-black/15 bg-white shadow-sm">
          <svg viewBox="0 0 120 120" className="text-black w-14 h-14 sm:w-16 sm:h-16" aria-hidden>
            <rect x="20" y="40" width="80" height="60" rx="8" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="60" cy="70" r="12" fill="currentColor" opacity="0.12" />
            <circle cx="85" cy="55" r="5" fill="currentColor" />
            <rect x="45" y="28" width="30" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        <div className="mb-7 flex flex-wrap justify-center gap-2 text-[11px] sm:text-xs text-gray-600">
          <span className="rounded-full bg-gray-100 px-2.5 py-1">4 auto shots</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1">Live filters</span>
          <span className="rounded-full bg-gray-100 px-2.5 py-1">Instant download</span>
        </div>

        <button
          type="button"
          onClick={onEnter}
          className="w-full px-8 sm:px-10 py-3.5 sm:py-4 bg-black text-white text-sm sm:text-base font-bold rounded-full hover:bg-gray-800 active:scale-[0.98] shadow-xl inline-flex items-center justify-center gap-2"
        >
          Start Photo Booth
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <p className="mt-4 text-xs text-gray-500">
          Camera or upload • 4 automatic shots • instant download
        </p>
      </section>

      <footer className="absolute bottom-0 left-0 right-0 text-center safe-bottom">
        <p className="text-[10px] text-gray-400 tracking-wider">snapmemories by sagar</p>
      </footer>
    </main>
  );
}
