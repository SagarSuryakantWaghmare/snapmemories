'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { ModalProps } from '@/lib/types';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';

export default function Modal({ isOpen, imageSrc, onClose }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const [shownSrc, setShownSrc] = useState<string | null>(imageSrc);
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Keep the last image while the close animation plays.
  useEffect(() => {
    if (imageSrc) setShownSrc(imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  // Escape to close + lock body scroll while mounted.
  useEffect(() => {
    if (!mounted) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mounted, onClose]);

  useGSAP(
    () => {
      if (!mounted) return;
      const backdrop = backdropRef.current;
      const dialog = dialogRef.current;
      if (!backdrop || !dialog) return;

      const focusClose = () =>
        dialog.querySelector<HTMLButtonElement>('[data-modal-close]')?.focus();

      if (isOpen) {
        if (reducedMotion()) {
          gsap.set([backdrop, dialog], { autoAlpha: 1, scale: 1, y: 0 });
          focusClose();
          return;
        }
        gsap
          .timeline({ onComplete: focusClose })
          .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: DUR.fast })
          .fromTo(
            dialog,
            { autoAlpha: 0, scale: 0.9, y: 14 },
            { autoAlpha: 1, scale: 1, y: 0, duration: DUR.base, ease: EASE.pop },
            '-=0.12',
          );
      } else {
        if (reducedMotion()) {
          setMounted(false);
          return;
        }
        gsap
          .timeline({ onComplete: () => setMounted(false) })
          .to(dialog, { autoAlpha: 0, scale: 0.92, y: 12, duration: DUR.fast, ease: EASE.soft })
          .to(backdrop, { autoAlpha: 0, duration: DUR.fast }, '-=0.1');
      }
    },
    { dependencies: [isOpen, mounted] },
  );

  if (!mounted || !shownSrc) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/75 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
      style={{ opacity: 0 }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Photo preview"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-card p-3 shadow-lift sm:p-4"
        onClick={(event) => event.stopPropagation()}
        style={{ opacity: 0 }}
      >
        <button
          type="button"
          data-modal-close
          onClick={onClose}
          className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/80 text-white backdrop-blur-sm transition-colors hover:bg-ink active:scale-95"
          aria-label="Close photo preview"
          title="Close preview"
        >
          <X className="h-5 w-5" />
        </button>

        <Image
          src={shownSrc}
          alt="Enlarged photo preview"
          width={800}
          height={600}
          className="h-auto w-full rounded-2xl"
          priority
        />

        <button
          type="button"
          onClick={onClose}
          className="mt-3 min-h-12 w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]"
          aria-label="Close photo preview"
        >
          Close preview
        </button>
      </div>
    </div>
  );
}
