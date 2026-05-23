'use client';

import { useRef } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { TemplateSelectionProps } from '@/lib/types';
import { gsap, useGSAP, EASE, DUR, reducedMotion } from '@/lib/motion';
import FloatingNav from './FloatingNav';

export default function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onContinue,
  onHome,
}: TemplateSelectionProps) {
  const root = useRef<HTMLDivElement>(null);

  // Entrance — runs once.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: EASE.out } })
        .from('[data-reveal]', { y: 26, autoAlpha: 0, duration: DUR.base, stagger: 0.08, clearProps: 'transform' })
        .from(
          '[data-card]',
          {
            y: 34,
            scale: 0.92,
            autoAlpha: 0,
            duration: DUR.base,
            ease: EASE.pop,
            stagger: 0.06,
            clearProps: 'transform',
          },
          '-=0.3',
        )
        .from('[data-cta-bar]', { y: 40, autoAlpha: 0, duration: DUR.base }, '-=0.4');
    },
    { scope: root },
  );

  // Pops the check badge whenever the selection changes.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.from('[data-check]', {
        scale: 0,
        rotate: -40,
        autoAlpha: 0,
        duration: DUR.fast,
        ease: EASE.pop,
      });
    },
    { scope: root, dependencies: [selectedTemplate.id] },
  );

  return (
    <div ref={root} className="grain relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <FloatingNav showBack={!!onHome} onBack={onHome} step={1} />

      <header data-reveal className="px-6 pb-5 pt-24 text-center sm:pt-28">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
          Step one
        </span>
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">Choose your style</h1>
        <p className="mt-2 text-sm text-ink-soft">
          Selected{' '}
          <span className="font-semibold text-ink">{selectedTemplate.name}</span>
          {' — '}
          {selectedTemplate.description.toLowerCase()}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-32 sm:px-6">
        <div className="mx-auto grid max-w-xl grid-cols-2 gap-3.5 sm:gap-4">
          {templates.map((template) => {
            const isSelected = selectedTemplate.id === template.id;

            return (
              <button
                key={template.id}
                type="button"
                data-card
                onClick={() => onSelectTemplate(template)}
                aria-pressed={isSelected}
                aria-label={`Select ${template.name} template`}
                className={`group relative overflow-hidden rounded-3xl border-2 bg-card text-left shadow-soft transition-[border-color,box-shadow,transform] hover:-translate-y-1 hover:shadow-card active:translate-y-0 ${
                  isSelected ? 'border-accent shadow-card' : 'border-line'
                }`}
              >
                {/* Preview area */}
                <div
                  className="relative flex aspect-[4/5] items-center justify-center overflow-hidden p-4"
                  style={{ background: template.colors.background }}
                >
                  <div className="flex h-full w-10 flex-col gap-1">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="flex flex-1 items-center justify-center bg-gradient-to-br from-paper-deep to-cream transition-transform duration-300 group-hover:scale-[1.03]"
                        style={{
                          borderWidth: Math.max(1, template.borderStyle.width / 3),
                          borderColor: template.borderStyle.color,
                          borderStyle: template.borderStyle.pattern === 'solid' ? 'solid' : 'dashed',
                          borderRadius: 3,
                        }}
                      >
                        <span className="text-[8px] font-semibold text-ink-faint">{n}</span>
                      </div>
                    ))}
                  </div>

                  {template.decorations.type === 'confetti' && (
                    <div className="pointer-events-none absolute inset-0">
                      {[...Array(6)].map((_, i) => (
                        <span
                          key={i}
                          className="absolute h-1.5 w-1.5 rounded-full"
                          style={{
                            background: [
                              template.colors.primary,
                              template.colors.secondary,
                              template.colors.accent,
                            ][i % 3],
                            top: `${14 + i * 14}%`,
                            left: `${10 + (i % 2) * 76}%`,
                          }}
                        />
                      ))}
                    </div>
                  )}

                  {template.decorations.type === 'hearts' && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl opacity-20">💕</span>
                    </div>
                  )}

                  {template.decorations.type === 'neon' && (
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{ boxShadow: `inset 0 0 26px ${template.colors.primary}55` }}
                    />
                  )}

                  {template.decorations.type === 'film' && (
                    <>
                      <div className="absolute inset-y-0 left-0 flex w-2 flex-col gap-0.5 bg-ink p-0.5">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex-1 rounded-[1px] bg-paper-soft" />
                        ))}
                      </div>
                      <div className="absolute inset-y-0 right-0 flex w-2 flex-col gap-0.5 bg-ink p-0.5">
                        {[...Array(10)].map((_, i) => (
                          <div key={i} className="flex-1 rounded-[1px] bg-paper-soft" />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Meta */}
                <div className="border-t border-line p-3.5">
                  <h3 className="truncate font-display text-[15px] font-semibold text-ink">
                    {template.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[11px] text-ink-soft">{template.description}</p>
                  <div className="mt-2.5 flex gap-1.5">
                    {[template.colors.primary, template.colors.secondary, template.colors.accent].map(
                      (color, i) => (
                        <span
                          key={i}
                          className="h-3 w-3 rounded-full ring-1 ring-line"
                          style={{ background: color }}
                        />
                      ),
                    )}
                  </div>
                </div>

                {isSelected && (
                  <span
                    data-check
                    className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[10px] font-bold text-white shadow-accent"
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                    Selected
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        data-cta-bar
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/85 px-5 pb-4 pt-3 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={onContinue}
          className="group mx-auto flex min-h-14 w-full max-w-md items-center justify-center gap-2.5 rounded-full bg-accent px-8 text-base font-semibold text-white shadow-accent transition-[background-color,box-shadow,transform] hover:bg-accent-deep hover:shadow-lift active:scale-[0.98]"
          aria-label={`Continue with the ${selectedTemplate.name} template`}
        >
          Continue with {selectedTemplate.name}
          <ArrowRight
            className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}
