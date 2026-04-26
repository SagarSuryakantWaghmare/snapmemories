'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { ModalProps } from '@/lib/types';

export default function Modal({ isOpen, imageSrc, onClose }: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    // Focus management
    const modalContent = document.querySelector('[role="dialog"]');
    if (modalContent instanceof HTMLElement) {
      const closeButton = modalContent.querySelector('button[aria-label*="Close"]') as HTMLButtonElement;
      closeButton?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Photo preview"
        className="relative bg-white border-2 border-black rounded-xl p-3 md:p-4 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-auto focus-visible:ring-2 focus-visible:ring-white"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-colors focus-visible:ring-2 focus-visible:ring-gray-500"
          aria-label="Close photo preview"
          title="Close preview"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <Image
          src={imageSrc}
          alt="Enlarged photo preview"
          width={800}
          height={600}
          className="w-full h-auto rounded"
          priority
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-3 md:mt-4 w-full px-4 md:px-6 py-3 sm:py-3.5 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 text-sm md:text-base transition-colors focus-visible:ring-2 focus-visible:ring-gray-500 min-h-11"
          aria-label="Close photo preview"
          title="Close and return"
        >
          Close
        </button>
      </div>
    </div>
  );
}
