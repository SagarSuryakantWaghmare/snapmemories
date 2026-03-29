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
    <div className="w-screen h-screen bg-bg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-gray-border bg-white flex-shrink-0">
        <h1
          onClick={onHome}
          className="cursor-pointer hover:opacity-70 transition-opacity"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#111',
          }}
        >
          MY SKETCH BOOTH
        </h1>
        <button
          onClick={onHome}
          className="px-4 py-2 text-sm bg-ink text-bg rounded hover:opacity-90 transition-opacity font-bold"
        >
          HOME
        </button>
      </div>

      {/* Main Content - Horizontal Layout */}
      <div className="flex-1 flex gap-6 items-center justify-center p-6 overflow-hidden">
        {/* Grid */}
        <div className="flex-shrink-0">
          <div
            className="border-4 border-ink rounded-xl overflow-hidden bg-ink grid grid-cols-2 gap-1 shadow-lg"
            style={{ width: 'clamp(200px, 45vw, 420px)', aspectRatio: '4/3.2' }}
          >
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
                  className="relative overflow-hidden flex items-center justify-center bg-black"
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
                      <div className="flex flex-col items-center gap-1 text-gray-400">
                        <span className="text-xl">+</span>
                        <span
                          className="text-xs"
                          style={{
                            fontFamily: "'Patrick Hand', cursive",
                          }}
                        >
                          Pic {i + 1}
                        </span>
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

        {/* Controls Panel */}
        <div className="flex flex-col gap-4 items-center flex-shrink-0">
          {/* Record Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onRecordClick}
              disabled={recordDisabled}
              className="w-16 h-16 bg-white border-4 border-ink rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed active:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 bg-accent rounded-full border-2 border-ink" style={{ boxShadow: '0 0 8px rgba(224,48,48,0.5)' }}></div>
              <div className="w-4 h-5 bg-ink rounded"></div>
            </button>
            <span
              className="text-xs text-center text-ink2"
              style={{ fontFamily: "'Patrick Hand', cursive" }}
            >
              Press to
              <br />
              start
            </span>
          </div>

          {/* BW Toggle */}
          <div className="flex items-center gap-2" style={{ fontFamily: "'Caveat', cursive", fontSize: '0.95rem', fontWeight: 700 }}>
            <span className="text-ink cursor-pointer select-none">B&W</span>
            <label className="relative w-12 h-7 cursor-pointer">
              <input
                type="checkbox"
                checked={isBW}
                onChange={(e) => onBWToggle(e.target.checked)}
                className="hidden"
              />
              <div className="sketch-track absolute inset-0 rounded-full bg-gray-slot border border-gray-border"></div>
              <div className="sketch-thumb absolute top-1 left-1 w-5 h-5 bg-ink rounded-full transition-all duration-200"></div>
            </label>
            <span className="text-ink cursor-pointer select-none">Color</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 border-2 border-dashed border-ink rounded text-ink2 text-xs font-bold hover:bg-black/5 transition-colors"
            style={{ fontFamily: "'Patrick Hand', cursive", width: '120px' }}
          >
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onUpload}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
