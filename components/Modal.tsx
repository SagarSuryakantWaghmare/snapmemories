'use client';

import Image from 'next/image';

interface ModalProps {
  isOpen: boolean;
  imageSrc: string | null;
  onClose: () => void;
}

export default function Modal({ isOpen, imageSrc, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center flex-col gap-4"
      onClick={onClose}
    >
      <div className="bg-white border-4 border-ink rounded-lg p-2 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div style={{
          width: 'clamp(150px, 65vw, 380px)',
          aspectRatio: '1',
          position: 'relative',
        }}>
          <Image
            src={imageSrc || ''}
            alt="Photo"
            fill
            className="rounded"
            style={{ borderRadius: '4px', objectFit: 'cover' }}
            unoptimized
          />
        </div>
      </div>
      <button
        onClick={onClose}
        className="bg-white border-4 border-ink rounded-lg font-caveat text-base px-5 py-2 cursor-pointer shadow-lg transition-all duration-100 hover:shadow-xl active:shadow-md"
        style={{
          boxShadow: '3px 3px 0 #111111',
        }}
      >
        ✕ Close
      </button>
    </div>
  );
}
