'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { BoothScreenProps } from '@/lib/types';

export default function BoothScreen({
  isBW,
  onBWToggle,
  onRecordClick,
  onUpload,
  onHome,
  recordDisabled,
  videoRef,
  photos,
  isCapturing,
}: BoothScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const mobilePreviewRef = useRef<HTMLVideoElement>(null);

  // Mirror the videoRef stream to the preview videos
  useEffect(() => {
    const updatePreviewStreams = () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        
        if (previewVideoRef.current && previewVideoRef.current.srcObject !== stream) {
          previewVideoRef.current.srcObject = stream;
          previewVideoRef.current.play().catch(e => console.log('Preview play error:', e));
        }
        
        if (mobilePreviewRef.current && mobilePreviewRef.current.srcObject !== stream) {
          mobilePreviewRef.current.srcObject = stream;
          mobilePreviewRef.current.play().catch(e => console.log('Mobile preview play error:', e));
        }
      }
    };

    // Update immediately
    updatePreviewStreams();
    
    // Also update on a slight delay to catch stream updates
    const timer = setTimeout(updatePreviewStreams, 100);
    
    return () => clearTimeout(timer);
  }, [videoRef]);

  return (
    <div className="w-full h-full min-h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Floating Home Button - Top Left */}
      <button
        onClick={onHome}
        className="fixed top-3 left-3 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full 
                   bg-black/70 backdrop-blur-sm text-white
                   hover:bg-black/90 active:scale-95
                   transition-all duration-150 shadow-lg
                   flex items-center justify-center"
        aria-label="Home"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {/* Floating Upload Button - Bottom Left */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-20 left-3 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full
                   bg-black/70 backdrop-blur-sm text-white
                   hover:bg-black/90 active:scale-95
                   transition-all duration-150 shadow-lg
                   flex items-center justify-center"
        aria-label="Upload Photos"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onUpload}
        className="hidden"
      />

      {/* Floating B&W Toggle - Bottom Right */}
      <div className="fixed bottom-20 right-3 z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full
                      bg-black/70 backdrop-blur-sm shadow-lg">
        <span className="text-[10px] sm:text-xs font-medium text-white">Color</span>
        <button
          onClick={() => onBWToggle(!isBW)}
          className={`relative w-10 h-5 sm:w-12 sm:h-6 rounded-full transition-colors ${
            isBW ? 'bg-white' : 'bg-gray-400'
          }`}
          aria-label="Toggle Black & White"
        >
          <div
            className={`absolute top-0.5 w-4 h-4 sm:w-5 sm:h-5 bg-black rounded-full shadow transition-transform ${
              isBW ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="text-[10px] sm:text-xs font-medium text-white">B&W</span>
      </div>

      {/* Main Content - Full Screen */}
      <div className="flex-1 flex items-center justify-center gap-3 sm:gap-6 p-3 sm:p-4 pt-16 pb-32 overflow-hidden">
        {/* Hidden video element - always mounted for reliable capture */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="hidden"
        />
        
        {/* Large Video Preview (Desktop) */}
        <div className="shrink-0 hidden md:block">
          <div
            className="bg-white border-2 border-black rounded-lg p-1.5 shadow-lg overflow-hidden"
            style={{ width: 'min(320px, 40vw)', aspectRatio: '1/1' }}
          >
            <video
              ref={previewVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded"
              style={{
                transform: 'scaleX(-1)',
                filter: isBW ? 'grayscale(1) contrast(1.1)' : 'none',
              }}
            />
          </div>
        </div>
        
        {/* Photo Strip Preview */}
        <div className="shrink-0">
          <div
            className="bg-white border-2 border-black rounded-lg p-1.5 shadow-lg"
            style={{ width: 'min(140px, 40vw)' }}
          >
            <div className="flex flex-col gap-0.5">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 border border-gray-200 rounded overflow-hidden"
                  style={{ width: '100%', aspectRatio: '1/1' }}
                  id={`photo-cell-${index}`}
                >
                  {/* Live video preview in first cell when idle (mobile only) */}
                  {!photos[index] && index === 0 && !isCapturing && (
                    <video
                      ref={mobilePreviewRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover md:hidden"
                      style={{
                        transform: 'scaleX(-1)',
                        filter: isBW ? 'grayscale(1) contrast(1.1)' : 'none',
                      }}
                    />
                  )}
                  
                  {/* Captured photo */}
                  {photos[index] && (
                    <Image
                      src={photos[index]!}
                      alt={`Photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  )}

                  {/* Empty state - show cell number */}
                  {!photos[index] && (index > 0 || isCapturing) && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-lg sm:text-xl font-bold">{index + 1}</span>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  <div
                    id={`countdown-${index}`}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-4xl sm:text-5xl font-bold opacity-0 pointer-events-none transition-opacity"
                  />

                  {/* Flash effect */}
                  <div
                    id={`flash-${index}`}
                    className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
                  />
                </div>
              ))}
            </div>
            {/* Branding */}
            <p className="text-[7px] sm:text-[8px] text-center text-gray-400 mt-1 tracking-wider">
              snapmemoriesbysagar
            </p>
          </div>
        </div>
      </div>

      {/* Floating Capture Button - Center Bottom */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5">
        <button
          onClick={onRecordClick}
          disabled={recordDisabled || isCapturing}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black text-white flex items-center justify-center
                   border-4 border-white shadow-2xl
                   hover:bg-gray-800 active:scale-95
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-150"
          aria-label="Capture Photos"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white" />
        </button>
        <p className="text-xs sm:text-sm text-black font-bold bg-white/90 px-2.5 py-0.5 rounded-full shadow">
          {isCapturing ? 'Capturing...' : 'Capture'}
        </p>
      </div>
    </div>
  );
}
