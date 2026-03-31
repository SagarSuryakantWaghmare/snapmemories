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

  // Mirror the videoRef stream to the preview video
  useEffect(() => {
    if (videoRef.current && previewVideoRef.current) {
      previewVideoRef.current.srcObject = videoRef.current.srcObject;
    }
  }, [videoRef]);

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 shrink-0">
        <h1 className="text-xl font-bold text-black">Photo Booth</h1>
        <button
          onClick={onHome}
          className="px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded transition-colors"
        >
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center gap-4 md:gap-8 p-4 md:p-6 overflow-auto max-h-[calc(100vh-4rem)]">
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
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover md:hidden"
                      ref={(el) => {
                        if (el && videoRef.current) {
                          el.srcObject = videoRef.current.srcObject;
                        }
                      }}
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

        {/* Controls */}
        <div className="flex flex-col items-center gap-4 md:gap-6 shrink-0">
          {/* Capture Button */}
          <button
            onClick={onRecordClick}
            disabled={recordDisabled || isCapturing}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black text-white flex items-center justify-center
                     border-4 border-gray-300
                     hover:bg-gray-800 active:bg-gray-900
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-150 shadow-lg"
          >
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white" />
          </button>
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {isCapturing ? 'Capturing...' : 'Capture'}
          </p>

          {/* B&W Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Color</span>
            <button
              onClick={() => onBWToggle(!isBW)}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                isBW ? 'bg-black' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  isBW ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-sm font-medium text-gray-700">B&W</span>
          </div>

          {/* Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2 border-2 border-black text-black font-medium rounded hover:bg-gray-100 transition-colors"
          >
            Upload Photos
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
