'use client';

import { ModalProps } from '@/lib/types';

export default function Modal({ isOpen, imageSrc, onClose }: ModalProps) {
  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white border-3 border-black rounded-lg p-3 md:p-4 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageSrc}
          alt="Enlarged photo"
          className="w-full h-auto rounded"
        />
        <button
          onClick={onClose}
          className="mt-3 md:mt-4 w-full px-4 md:px-6 py-2 md:py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors text-sm md:text-base"
        >
          Close
        </button>
      </div>
    </div>
  );
}
