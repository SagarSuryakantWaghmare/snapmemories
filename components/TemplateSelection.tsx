'use client';

import { Check, ArrowRight } from 'lucide-react';
import { TemplateSelectionProps } from '@/lib/types';
import FloatingNav from './FloatingNav';

export default function TemplateSelection({
  templates,
  selectedTemplate,
  onSelectTemplate,
  onContinue,
  onHome,
}: TemplateSelectionProps) {
  return (
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-black flex flex-col overflow-hidden">
      <FloatingNav showBack={!!onHome} onBack={onHome} />

      <main className="flex h-full min-h-screen flex-col">
        <header className="pt-14 sm:pt-16 pb-4 text-center px-4 animate-fade-in-down">
          <p className="text-[11px] sm:text-xs uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400 font-semibold mb-1 opacity-75">Step 1 of 3</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mt-1">Choose your style</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
            Selected: <span className="font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full inline-flex mt-1">{selectedTemplate.name}</span> 
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{selectedTemplate.description}</p>
        </header>

        <div className="flex-1 overflow-auto px-3 pb-28 sm:pb-32">
          <div className="max-w-xl mx-auto grid grid-cols-2 gap-3 sm:gap-4">
            {templates.map((template, index) => {
              const isSelected = selectedTemplate.id === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => onSelectTemplate(template)}
                  aria-pressed={isSelected}
                  aria-label={`Select ${template.name} template`}
                  className={`relative group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-button-hover dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] active:scale-[0.98] animate-fade-in ${
                    isSelected ? 'border-black dark:border-white shadow-lg dark:shadow-[0_10px_25px_rgba(0,0,0,0.3)] scale-100' : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                  style={{ animationDelay: `${index * 75}ms` }}
                >
                  <div
                    className="aspect-[3/4] p-3 flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300"
                    style={{ background: template.colors.background }}
                  >
                    <div className="w-full max-w-[80px] flex flex-col gap-0.5">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                           className="aspect-square bg-gray-200 rounded-sm flex items-center justify-center hover:scale-105 transition-transform duration-200 group-hover:shadow-sm"
                          style={{
                            borderWidth: Math.max(1, template.borderStyle.width / 3),
                            borderColor: template.borderStyle.color,
                            borderStyle: template.borderStyle.pattern === 'solid' ? 'solid' : 'dashed',
                          }}
                        >
                           <span className="text-[8px] text-gray-400 dark:text-gray-500 font-medium">{index}</span>
                        </div>
                      ))}
                    </div>

                    {template.decorations.type === 'confetti' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full animate-bounce-soft"
                            style={{
                              background: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                              top: `${15 + i * 15}%`,
                              left: `${10 + (i % 2) * 75}%`,
                              animationDelay: `${i * 100}ms`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {template.decorations.type === 'hearts' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-3xl opacity-20 animate-pulse-glow" style={{ color: template.colors.accent }}>
                          💕
                        </div>
                      </div>
                    )}

                    {template.decorations.type === 'neon' && (
                      <div
                        className="absolute inset-0 pointer-events-none group-hover:shadow-glow transition-shadow duration-300"
                        style={{ boxShadow: `inset 0 0 20px ${template.colors.primary}60` }}
                      />
                    )}

                    {template.decorations.type === 'film' && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col gap-0.5 p-0.5 bg-gray-900">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm hover:bg-gray-400 transition-colors" />
                          ))}
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col gap-0.5 p-0.5 bg-gray-900">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm hover:bg-gray-400 transition-colors" />
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                    <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-left">
                     <h3 className="font-semibold text-xs sm:text-sm text-black dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{template.name}</h3>
                     <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{template.description}</p>

                    <div className="flex gap-1.5 mt-2">
                       <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform" style={{ background: template.colors.primary }} />
                       <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform" style={{ background: template.colors.secondary }} />
                       <div className="w-3 h-3 rounded-full border border-gray-200 dark:border-gray-600 hover:scale-125 transition-transform" style={{ background: template.colors.accent }} />
                    </div>
                  </div>

                  {isSelected && (
                     <div className="absolute top-3 right-3 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] px-2.5 py-1 shadow-lg font-semibold animate-scale-in flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 pb-4 safe-bottom bg-gradient-to-t from-white dark:from-gray-900 via-white/95 dark:via-gray-900/95 to-transparent backdrop-blur-sm border-t border-black/5 dark:border-white/10 shadow-xl dark:shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
          <button
            type="button"
            onClick={onContinue}
            className="w-full max-w-md mx-auto block px-8 sm:px-10 py-3 sm:py-3.5 bg-gradient-to-r from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black text-sm sm:text-base font-bold rounded-full hover:shadow-button-hover dark:hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] active:scale-[0.98] shadow-lg dark:shadow-lg transition-all duration-200 group relative overflow-hidden"
            aria-label={`Continue with ${selectedTemplate.name} template`}
            title={`Proceed with ${selectedTemplate.name}`}
          >
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              Continue with {selectedTemplate.name}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </div>
      </main>
    </div>
  );
}
