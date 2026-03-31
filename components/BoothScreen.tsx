'use client';

import { useRef, useEffect } from 'react';
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
  currentPhotoIndex,
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
  }, [videoRef.current?.srcObject]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden relative">
      {/* Floating Home Button - Top Left */}
      <button
        onClick={onHome}
        className="fixed top-4 left-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full 
                   bg-black/70 backdrop-blur-sm text-white
                   hover:bg-black/90 active:scale-95
                   transition-all duration-150 shadow-lg
                   flex items-center justify-center"
        aria-label="Home"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      {/* Floating Upload Button - Bottom Left */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="fixed bottom-4 left-4 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full
                   bg-black/70 backdrop-blur-sm text-white
                   hover:bg-black/90 active:scale-95
                   transition-all duration-150 shadow-lg
                   flex items-center justify-center"
        aria-label="Upload Photos"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-full
                      bg-black/70 backdrop-blur-sm shadow-lg">
        <span className="text-xs md:text-sm font-medium text-white">Color</span>
        <button
          onClick={() => onBWToggle(!isBW)}
          className={`relative w-12 h-6 md:w-14 md:h-7 rounded-full transition-colors ${
            isBW ? 'bg-white' : 'bg-gray-400'
          }`}
          aria-label="Toggle Black & White"
        >
          <div
            className={`absolute top-0.5 w-5 h-5 md:w-6 md:h-6 bg-black rounded-full shadow transition-transform ${
              isBW ? 'translate-x-6 md:translate-x-7' : 'translate-x-0.5'
            }`}
          />
        </button>
        <span className="text-xs md:text-sm font-medium text-white">B&W</span>
      </div>

      {/* Main Content - Full Screen */}
      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 p-4 md:p-6 overflow-auto">
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
            className="bg-white border-3 border-black rounded-lg p-2 shadow-lg overflow-hidden"
            style={{ width: '400px', maxWidth: '85vw', aspectRatio: '1/1' }}
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
            className="bg-white border-3 border-black rounded-lg p-2 shadow-lg"
            style={{ width: '180px', maxWidth: '90vw' }}
          >
            <div className="flex flex-col gap-1">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="relative bg-gray-100 border-2 border-gray-300 rounded overflow-hidden"
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
                    <img
                      src={photos[index]!}
                      alt={`Photo ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Empty state - show cell number */}
                  {!photos[index] && (index > 0 || isCapturing) && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-2xl font-bold">{index + 1}</span>
                    </div>
                  )}

                  {/* Countdown overlay */}
                  <div
                    id={`countdown-${index}`}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold opacity-0 pointer-events-none transition-opacity"
                  />

                  {/* Flash effect */}
                  <div
                    id={`flash-${index}`}
                    className="absolute inset-0 bg-white opacity-0 pointer-events-none transition-opacity duration-100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating Capture Button - Center Bottom */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
          <button
            onClick={onRecordClick}
            disabled={recordDisabled || isCapturing}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black text-white flex items-center justify-center
                     border-4 md:border-6 border-white shadow-2xl
                     hover:bg-gray-800 active:scale-95
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150"
            aria-label="Capture Photos"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white" />
          </button>
          <p className="text-sm md:text-base text-black font-bold bg-white/90 px-3 py-1 rounded-full shadow">
            {isCapturing ? 'Capturing...' : 'Capture'}
          </p>
        </div>
      </div>
    </div>
  );
}
