'use client';

import { useRef } from 'react';

interface BoothScreenProps {
  isBW: boolean;
  onBWToggle: (checked: boolean) => void;
  onRecordClick: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onHome: () => void;
  recordDisabled: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  cells: Array<{
    type: 'live' | 'empty' | 'filled';
    src?: string;
    index: number;
  }>;
  cellRefs: React.RefObject<HTMLDivElement[]>;
}

export default function BoothScreen({
  isBW,
  onBWToggle,
  onRecordClick,
  onUpload,
  onHome,
  recordDisabled,
  videoRef,
  cells,
  cellRefs,
}: BoothScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="screen-active min-h-screen w-full bg-bg flex flex-col items-center px-4 md:px-8 py-6 md:py-8 gap-6">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between">
        <div
          onClick={onHome}
          className="font-caveat text-2xl font-bold text-ink cursor-pointer hover:opacity-65 transition-opacity"
        >
          mysketchbooth
        </div>
        <div
          className="flex flex-col items-center justify-center w-16 h-16 border-4 border-ink rounded-full bg-white font-caveat font-bold"
          style={{
            borderRadius: '55% 45% 50% 50% / 50% 55% 45% 50%',
          }}
        >
          <span className="text-lg">$0</span>
          <span className="font-patrick text-xs">= 4 pics</span>
        </div>
      </div>

      {/* Main Booth Layout */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row items-start justify-center gap-6 flex-wrap">
        {/* LEFT: KIOSK BOX */}
        <div className="relative">
          {/* Eye-level label - hidden on mobile */}
          <div className="hidden lg:flex absolute left-0 -ml-28 top-1/2 -translate-y-1/2 font-caveat text-lg font-bold text-ink gap-1 items-center whitespace-nowrap">
            <span>
              eye
              <br />
              level
            </span>
            <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
              <path
                d="M2 9 H24 M18 3 L26 9 L18 15"
                stroke="#111"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Kiosk Box */}
          <div className="relative bg-white border-4 border-ink rounded-3xl p-3 shadow-xl" 
            style={{ width: 'clamp(200px, 58vw, 380px)' }}>
            {/* Inner Grid */}
            <div
              className="border-4 border-ink rounded-xl overflow-hidden bg-ink grid grid-cols-2 grid-rows-2 gap-1"
              style={{ aspectRatio: '4/3.2' }}
            >
              {/* Grid Cells */}
              {[0, 1, 2, 3].map((i) => {
                const cell = cells[i] || { type: 'empty', index: i };
                return (
                  <div
                    key={i}
                    ref={(el) => {
                      if (cellRefs.current) {
                        cellRefs.current[i] = el!;
                      }
                    }}
                    className={`grid-cell relative overflow-hidden flex items-center justify-center ${
                      cell.type === 'live' ? 'live bg-black' : ''
                    } ${cell.type === 'empty' ? 'empty' : ''} ${
                      cell.type === 'filled' ? 'filled bg-black' : ''
                    }`}
                  >
                    {cell.type === 'live' && (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover block"
                          style={{ transform: 'scaleX(-1)' }}
                        />
                        <div className="flash-cell" id={`flash-${i}`}></div>
                        <div className="cell-countdown" id={`cdown-${i}`}></div>
                      </>
                    )}
                    {cell.type === 'empty' && (
                      <>
                        <div className="flex flex-col items-center gap-1.5 text-gray-400 font-patrick text-sm">
                          <span className="text-2xl">+</span>
                          <span>Picture {i + 1}</span>
                        </div>
                        <div className="flash-cell" id={`flash-${i}`}></div>
                      </>
                    )}
                    {cell.type === 'filled' && cell.src && (
                      <img src={cell.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: RECORD BUTTON */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={onRecordClick}
            disabled={recordDisabled}
            className="w-16 bg-white border-4 border-ink rounded-xl p-2.5 flex flex-col items-center gap-2.5 cursor-pointer shadow-lg transition-all duration-100 hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
            style={{
              boxShadow: '4px 4px 0 #111111',
            }}
            onMouseDown={(e) => {
              if (!recordDisabled) {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '2px 2px 0 #111111';
              }
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '4px 4px 0 #111111';
            }}
          >
            {/* Red Circle */}
            <div
              className="w-8 h-8 bg-accent rounded-full border-2 border-ink"
              style={{
                boxShadow: '0 0 8px rgba(224,48,48,0.5)',
              }}
            ></div>
            {/* Black Bar */}
            <div className="w-4 h-5 bg-ink rounded"></div>
          </button>
          <div className="font-patrick text-xs text-ink2 text-center">
            Press to
            <br />
            start
          </div>
        </div>
      </div>

      {/* B&W Toggle */}
      <div className="flex items-center justify-center gap-4 font-caveat text-lg font-semibold text-ink">
        <span>b&w</span>
        <label className="relative w-14 h-8 cursor-pointer shrink-0">
          <input
            type="checkbox"
            checked={isBW}
            onChange={(e) => onBWToggle(e.target.checked)}
            className="hidden"
          />
          <div className="sketch-track" style={{ boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)' }}></div>
          <div className="sketch-thumb"></div>
        </label>
        <span>color</span>
      </div>

      {/* OR Divider */}
      <div className="w-full max-w-sm flex items-center justify-center gap-2 font-patrick text-sm text-gray-500">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span>or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-ink rounded-lg bg-transparent font-patrick text-sm text-ink2 px-5 py-2 cursor-pointer w-full max-w-sm transition-colors duration-150 hover:bg-black/5"
      >
        Upload photos from your device
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="hidden"
      />

      {/* Steps Section */}
      <div className="w-full max-w-2xl flex flex-col md:flex-row bg-white border-4 border-ink rounded-2xl overflow-hidden shadow-lg">
        {[
          'Choose b&w or color filters with the toggle switch',
          'Position yourself at eye level and click the red button',
          'Press the red button to take photos and wait for them to be printed',
        ].map((text, i) => (
          <div
            key={i}
            className={`flex-1 px-3 md:px-4 py-4 font-patrick text-sm text-ink leading-relaxed ${
              i < 2 ? 'border-r-2 md:border-r-4 border-ink md:border-b-0' : ''
            } ${i === 1 ? 'border-b-2 md:border-b-0 md:border-r-4 border-ink' : ''}`}
          >
            <span className="font-caveat text-2xl font-bold block mb-1">{i + 1}</span>
            {text}
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="text-center font-patrick text-xs text-gray-400 mt-4">
        © 2025 Sagar Suryakant Waghmare. All rights reserved.
      </footer>
    </div>
  );
}
