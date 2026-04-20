'use client';

import { PhotoStripTemplate } from '@/lib/templates';
import FloatingNav from './FloatingNav';

interface TemplateSelectionProps {
  templates: PhotoStripTemplate[];
  selectedTemplate: PhotoStripTemplate;
  onSelectTemplate: (template: PhotoStripTemplate) => void;
  onContinue: () => void;
  onHome?: () => void;
}

export default function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onContinue,
  onHome,
}: TemplateSelectionProps) {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col overflow-hidden">
      <FloatingNav showBack={!!onHome} onBack={onHome} />

      <main className="flex h-full min-h-screen flex-col">
        <header className="pt-14 sm:pt-16 pb-3 text-center px-4">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400 font-semibold">Step 1 of 3</p>
          <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white mt-1">Choose your style</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
            Selected: <span className="font-medium text-gray-700 dark:text-gray-300">{selectedTemplate.name}</span> - {selectedTemplate.description}
          </p>
        </header>

        <div className="flex-1 overflow-auto px-3 pb-28 sm:pb-32">
          <div className="max-w-xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
            {templates.map((template) => {
              const isSelected = selectedTemplate.id === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${template.name} template`}
                  className={`relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all duration-200 hover:shadow-lg active:scale-[0.98] ${
                    isSelected ? 'border-black dark:border-white shadow-md scale-[1.01]' : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div
                    className="aspect-[3/4] p-3 flex flex-col items-center justify-center relative"
                    style={{ background: template.colors.background }}
                  >
                    <div className="w-full max-w-[80px] flex flex-col gap-0.5">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-sm flex items-center justify-center"
                          style={{
                            borderWidth: Math.max(1, template.borderStyle.width / 3),
                            borderColor: template.borderStyle.color,
                            borderStyle: template.borderStyle.pattern === 'solid' ? 'solid' : 'dashed',
                          }}
                        >
                          <span className="text-[8px] text-gray-400 dark:text-gray-500">{index}</span>
                        </div>
                      ))}
                    </div>

                    {template.decorations.type === 'confetti' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                              background: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                              top: `${15 + i * 15}%`,
                              left: `${10 + (i % 2) * 75}%`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {template.decorations.type === 'hearts' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-2xl opacity-20" style={{ color: template.colors.accent }}>
                          💕
                        </div>
                      </div>
                    )}

                    {template.decorations.type === 'neon' && (
                      <div
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: `inset 0 0 15px ${template.colors.primary}40` }}
                      />
                    )}

                    {template.decorations.type === 'film' && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col gap-0.5 p-0.5 bg-gray-800">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm" />
                          ))}
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-1.5 flex flex-col gap-0.5 p-0.5 bg-gray-800">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div className="p-2.5 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-left">
                    <h3 className="font-semibold text-xs sm:text-sm text-black dark:text-white truncate">{template.name}</h3>
                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{template.description}</p>

                    <div className="flex gap-1 mt-1.5">
                      <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700" style={{ background: template.colors.primary }} />
                      <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700" style={{ background: template.colors.secondary }} />
                      <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-700" style={{ background: template.colors.accent }} />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] px-2 py-0.5 shadow">
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-2.5 pb-3 safe-bottom bg-gradient-to-t from-white via-white/95 to-transparent dark:from-gray-800 dark:via-gray-800/95 dark:to-transparent backdrop-blur-sm border-t border-black/5 dark:border-white/10">
          <button
            type="button"
            onClick={onContinue}
            className="w-full max-w-md mx-auto block px-8 sm:px-10 py-3 sm:py-3.5 bg-black dark:bg-white text-white dark:text-black text-sm sm:text-base font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-[0.98] shadow-xl transition-colors min-h-12"
            aria-label={`Continue with ${selectedTemplate.name} template`}
            title={`Proceed with ${selectedTemplate.name}`}
          >
            Continue with {selectedTemplate.name} →
          </button>
        </div>
      </main>
    </div>
  );
}
