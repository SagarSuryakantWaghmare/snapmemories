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
    <div className="w-full h-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack={!!onHome} onBack={onHome} />

      {/* Title */}
      <div className="pt-14 pb-3 text-center shrink-0 px-4">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Choose Your Style</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Select a photo strip template
        </p>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-auto px-3 pb-24">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {templates.map((template) => {
              const isSelected = selectedTemplate.id === template.id;
              
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className={`
                    relative group
                    bg-white rounded-lg overflow-hidden
                    border-2 transition-all duration-200
                    hover:shadow-lg active:scale-[0.98]
                    ${isSelected ? 'border-black shadow-md' : 'border-gray-200'}
                  `}
                >
                  {/* Template Preview */}
                  <div 
                    className="aspect-[3/4] p-3 flex flex-col items-center justify-center relative"
                    style={{
                      background: template.colors.background.startsWith('linear-gradient')
                        ? template.colors.background
                        : template.colors.background,
                    }}
                  >
                    {/* Mini photo strip preview */}
                    <div className="w-full max-w-[80px] flex flex-col gap-0.5">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-sm flex items-center justify-center"
                          style={{
                            borderWidth: Math.max(1, template.borderStyle.width / 3),
                            borderColor: template.borderStyle.color,
                            borderStyle: template.borderStyle.pattern === 'solid' ? 'solid' : 'dashed',
                          }}
                        >
                          <span className="text-[8px] text-gray-400">{index}</span>
                        </div>
                      ))}
                    </div>

                    {/* Decoration indicators */}
                    {template.decorations.type === 'confetti' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1.5 h-1.5 rounded-full"
                            style={{
                              background: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                              top: `${15 + (i * 15)}%`,
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
                        style={{
                          boxShadow: `inset 0 0 15px ${template.colors.primary}40`,
                        }}
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

                  {/* Template Info */}
                  <div className="p-2 border-t border-gray-100 bg-white">
                    <h3 className="font-semibold text-xs text-black truncate">
                      {template.name}
                    </h3>

                    {/* Color swatches */}
                    <div className="flex gap-1 mt-1">
                      <div
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ background: template.colors.primary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ background: template.colors.secondary }}
                      />
                      <div
                        className="w-3 h-3 rounded-full border border-gray-200"
                        style={{ background: template.colors.accent }}
                      />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center shadow">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Floating Continue Button */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onContinue}
          className="px-8 sm:px-10 py-3 sm:py-3.5 bg-black text-white text-sm sm:text-base font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-xl"
        >
          Continue to Booth →
        </button>
      </div>

      {/* Bottom Branding */}
      <div className="fixed bottom-16 left-0 right-0 text-center pointer-events-none">
        <p className="text-[9px] text-gray-400 tracking-wider">
          snapmemoriesbysagar
        </p>
      </div>
    </div>
  );
}
