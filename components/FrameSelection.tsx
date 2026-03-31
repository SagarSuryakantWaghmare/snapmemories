'use client';

import { FrameSelectionProps } from '@/lib/types';
import { FRAMES } from '@/lib/constants';

export default function FrameSelection({
  photos,
  currentFrameIndex,
  onFrameChange,
  onSelectFrame,
  onHome,
}: FrameSelectionProps) {
  const currentFrame = FRAMES[currentFrameIndex % FRAMES.length];

  return (
    <div className="w-screen h-screen bg-white flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-16 border-b-2 border-black flex items-center justify-between px-6 shrink-0">
        <h1 className="text-xl font-bold text-black">Choose Your Frame</h1>
        <button
          onClick={onHome}
          className="px-4 py-2 text-sm font-semibold text-black hover:bg-gray-100 rounded transition-colors"
        >
          Home
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 md:gap-8 p-4 md:p-6 overflow-auto max-h-[calc(100vh-4rem)]">
        {/* Frame Selector */}
        <div className="flex items-center gap-4 md:gap-8">
          {/* Left Arrow */}
          <button
            onClick={() => onFrameChange((currentFrameIndex - 1 + FRAMES.length) % FRAMES.length)}
            className="text-4xl md:text-5xl text-black hover:text-gray-600 transition-colors shrink-0"
          >
            ‹
          </button>

          {/* Frame Preview */}
          <div className="flex flex-col items-center gap-3 md:gap-4">
            <div className="bg-white border-3 border-black rounded-lg p-3 md:p-4 shadow-lg" style={{ width: '180px', maxWidth: '85vw' }}>
              <div className="flex flex-col gap-1">
                {photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative bg-gray-100 border-2 border-gray-300 rounded overflow-hidden"
                    style={{ width: '100%', aspectRatio: '1/1' }}
                  >
                    {photo ? (
                      <img
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-2xl">{i + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Frame Name */}
            <p className="text-base md:text-lg font-semibold text-black">{currentFrame.name}</p>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => onFrameChange((currentFrameIndex + 1) % FRAMES.length)}
            className="text-4xl md:text-5xl text-black hover:text-gray-600 transition-colors shrink-0"
          >
            ›
          </button>
        </div>

        {/* Select Button */}
        <button
          onClick={onSelectFrame}
          className="px-8 md:px-12 py-3 md:py-4 bg-black text-white text-base md:text-lg font-semibold rounded-lg 
                     hover:bg-gray-800 active:bg-gray-900 
                     transition-all duration-150 
                     shadow-lg hover:shadow-xl"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
