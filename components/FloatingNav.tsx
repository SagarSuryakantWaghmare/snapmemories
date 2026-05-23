'use client';

import { ArrowLeft, Check } from 'lucide-react';
import { FloatingNavProps } from '@/lib/types';

const STEP_LABELS = ['Style', 'Frame', 'Strip'];

export default function FloatingNav({ onBack, showBack = false, step }: FloatingNavProps) {
  return (
    <div className="safe-top pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center p-3 sm:p-4">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          className="group pointer-events-auto inline-flex h-11 items-center gap-1.5 rounded-full border border-line bg-card/85 pl-2.5 pr-4 text-sm font-medium text-ink shadow-soft backdrop-blur-md hover:bg-card hover:shadow-card active:scale-95"
          aria-label="Go back to the previous screen"
          title="Back"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          Back
        </button>
      )}

      {step != null && (
        <div className="pointer-events-auto absolute left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-card/85 px-3 py-2 shadow-soft backdrop-blur-md">
          {STEP_LABELS.map((label, i) => {
            const n = i + 1;
            const done = n < step;
            const active = n === step;
            return (
              <span key={label} className="flex items-center gap-1.5">
                <span
                  className={`grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold transition-colors ${
                    done
                      ? 'bg-accent text-white'
                      : active
                        ? 'bg-ink text-white'
                        : 'bg-paper-deep text-ink-faint'
                  }`}
                >
                  {done ? <Check className="h-3 w-3" strokeWidth={3} /> : n}
                </span>
                <span
                  className={`text-[11px] font-semibold transition-colors ${
                    active ? 'text-ink' : 'text-ink-faint'
                  } ${active ? 'inline' : 'hidden sm:inline'}`}
                >
                  {label}
                </span>
                {n < STEP_LABELS.length && (
                  <span className={`mx-0.5 h-px w-3 ${done ? 'bg-accent' : 'bg-line-bold'}`} />
                )}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
