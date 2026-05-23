'use client';

import { useRef } from 'react';
import { Camera, Sparkles, Download, ArrowRight, Smile, Heart } from 'lucide-react';
import { HomeScreenProps } from '@/lib/types';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';

const FEATURES = [
  { icon: Camera, label: '4 auto shots' },
  { icon: Sparkles, label: 'Live filters' },
  { icon: Download, label: 'Instant download' },
];

export default function HomeScreen({ onEnter }: HomeScreenProps) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reducedMotion()) return;

      gsap.set('[data-strip]', { rotation: -5, transformOrigin: '50% 60%' });

      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from('[data-strip-back]', { autoAlpha: 0, duration: DUR.base }, 0)
        .from(
          '[data-strip]',
          { scale: 0.78, rotation: -22, autoAlpha: 0, duration: DUR.slow, ease: EASE.pop },
          0,
        )
        .from(
          '[data-reveal]',
          { y: 30, autoAlpha: 0, duration: DUR.base, stagger: 0.08, clearProps: 'transform' },
          0.32,
        )
        .from(
          '[data-chip]',
          {
            y: 16,
            scale: 0.9,
            autoAlpha: 0,
            duration: DUR.fast,
            ease: EASE.pop,
            stagger: 0.07,
            clearProps: 'transform',
          },
          '-=0.3',
        )
        .from('[data-cta]', { y: 20, autoAlpha: 0, duration: DUR.base, clearProps: 'transform' }, '-=0.25')
        .to(
          '[data-strip]',
          { y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: 'sine.inOut' },
          '>-0.4',
        );
    },
    { scope: root },
  );

  return (
    <main className="grain relative flex min-h-screen w-full flex-col overflow-hidden" ref={root}>
      {/* Ambient warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-accent-soft opacity-70 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-paper-deep opacity-60 blur-3xl"
      />

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
        {/* Hero polaroid */}
        <div className="relative mb-7 h-[238px] w-[208px]">
          <div
            data-strip-back
            aria-hidden
            style={{ transform: 'translate(20px, 16px) rotate(9deg)' }}
            className="absolute inset-0 rounded-2xl bg-accent-soft"
          />
          <div
            data-strip
            className="absolute inset-0 rounded-2xl bg-card p-3.5 pb-11 shadow-lift ring-1 ring-line"
          >
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-gradient-to-br from-paper-deep to-cream ring-1 ring-line">
              <Smile
                className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 text-ink-faint"
                strokeWidth={1.5}
              />
              <Sparkles className="absolute right-3 top-3 h-5 w-5 text-accent/70" />
              <Heart className="absolute bottom-3 left-3 h-4 w-4 text-accent/45" />
            </div>
            <p className="absolute inset-x-0 bottom-3 text-center font-display text-[15px] italic text-ink-faint">
              snapmemories
            </p>
          </div>
        </div>

        {/* Eyebrow */}
        <span
          data-reveal
          className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          The snapmemories booth
        </span>

        {/* Headline */}
        <h1
          data-reveal
          className="mt-3.5 text-balance font-display text-[2.25rem] leading-[1.07] text-ink sm:text-5xl"
        >
          Strike a pose,
          <br />
          <span className="italic text-accent">keep the moment.</span>
        </h1>

        {/* Subtitle */}
        <p
          data-reveal
          className="mt-4 max-w-sm text-balance text-[14px] leading-relaxed text-ink-soft sm:text-[15px]"
        >
          Take four quick shots, then dress your strip with filters and frames — yours to
          download in seconds.
        </p>

        {/* Feature chips */}
        <div data-reveal className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          {FEATURES.map(({ icon: Icon, label }) => (
            <span
              key={label}
              data-chip
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-card/80 px-3.5 py-2 text-xs font-medium text-ink-soft shadow-soft backdrop-blur"
            >
              <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={2} />
              {label}
            </span>
          ))}
        </div>

        {/* Call to action */}
        <div data-cta className="mt-7 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onEnter}
            className="group inline-flex min-h-14 items-center justify-center gap-2.5 rounded-full bg-accent px-10 py-4 text-base font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep hover:shadow-lift active:scale-[0.97]"
            aria-label="Start the photo booth"
            title="Start capturing photos"
          >
            Enter the booth
            <ArrowRight
              className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
          <p className="inline-flex items-center gap-1.5 text-xs text-ink-faint">
            <Camera className="h-3.5 w-3.5" strokeWidth={2} />
            Use your camera or upload photos — no sign-up
          </p>
        </div>
      </div>

      <footer className="safe-bottom relative pb-4 text-center">
        <p className="text-[11px] tracking-[0.16em] text-ink-faint">
          snapmemories · crafted by sagar
        </p>
      </footer>
    </main>
  );
}
