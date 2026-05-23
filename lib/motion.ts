'use client';

// Shared GSAP setup for snapmemories.
// Every animated component imports gsap/useGSAP from here so the
// plugin is registered exactly once and easings stay consistent.

import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };

/** Named easings — keep motion consistent across screens. */
export const EASE = {
  /** Entrances: decisive settle. */
  out: 'power3.out',
  /** Transitions both ways. */
  inOut: 'power2.inOut',
  /** Playful overshoot for pops / reveals. */
  pop: 'back.out(1.6)',
  /** Gentle, short interactions. */
  soft: 'power2.out',
} as const;

/** Named durations (seconds). */
export const DUR = {
  xfast: 0.22,
  fast: 0.36,
  base: 0.55,
  slow: 0.85,
} as const;

/** True when the user asked the OS to reduce motion. */
export function reducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}
