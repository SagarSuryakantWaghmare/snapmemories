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
    <div className="w-screen h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-hidden">
      {/* Floating Navigation */}
      <FloatingNav showBack={!!onHome} onBack={onHome} />

      {/* Title */}
      <div className="pt-8 pb-4 text-center shrink-0">
        <h1 className="text-2xl md:text-3xl font-bold text-black">Choose Your Style</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">
          Select a photo strip template to personalize your photos
        </p>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {templates.map((template) => {
              const isSelected = selectedTemplate.id === template.id;
              
              return (
                <button
                  key={template.id}
                  onClick={() => onSelectTemplate(template)}
                  className={`
                    relative group
                    bg-white rounded-xl overflow-hidden
                    border-3 transition-all duration-200
                    hover:shadow-xl hover:scale-105
                    ${isSelected ? 'border-black shadow-lg scale-105' : 'border-gray-300'}
                  `}
                >
                  {/* Template Preview */}
                  <div 
                    className="aspect-[3/4] p-4 flex flex-col items-center justify-center relative"
                    style={{
                      background: template.colors.background.startsWith('linear-gradient')
                        ? template.colors.background
                        : template.colors.background,
                    }}
                  >
                    {/* Mini photo strip preview */}
                    <div className="w-full max-w-[120px] flex flex-col gap-1">
                      {[1, 2, 3, 4].map((index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-200 rounded-sm flex items-center justify-center"
                          style={{
                            borderWidth: Math.max(1, template.borderStyle.width / 2),
                            borderColor: template.borderStyle.color,
                            borderStyle: template.borderStyle.pattern === 'solid' ? 'solid' : 'dashed',
                          }}
                        >
                          <span className="text-xs text-gray-400">{index}</span>
                        </div>
                      ))}
                    </div>

                    {/* Decoration indicators */}
                    {template.decorations.type === 'confetti' && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 rounded-full"
                            style={{
                              background: [template.colors.primary, template.colors.secondary, template.colors.accent][i % 3],
                              top: `${Math.random() * 100}%`,
                              left: `${Math.random() * 100}%`,
                              transform: `rotate(${Math.random() * 360}deg)`,
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {template.decorations.type === 'hearts' && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <div className="text-4xl opacity-20" style={{ color: template.colors.accent }}>
                          💕
                        </div>
                      </div>
                    )}

                    {template.decorations.type === 'neon' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: `inset 0 0 20px ${template.colors.primary}40`,
                        }}
                      />
                    )}

                    {template.decorations.type === 'film' && (
                      <>
                        <div className="absolute left-0 top-0 bottom-0 w-2 flex flex-col gap-1 p-0.5 bg-gray-800">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm" />
                          ))}
                        </div>
                        <div className="absolute right-0 top-0 bottom-0 w-2 flex flex-col gap-1 p-0.5 bg-gray-800">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="flex-1 bg-gray-300 rounded-sm" />
                          ))}
                        </div>
                      </>
                    )}

                    {template.decorations.type === 'polaroid' && (
                      <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                        }}
                      />
                    )}
                  </div>

                  {/* Template Info */}
                  <div className="p-3 md:p-4 border-t-2 border-gray-200 bg-white">
                    <h3 className="font-bold text-sm md:text-base text-black mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-2">
                      {template.description}
                    </p>

                    {/* Color swatches */}
                    <div className="flex gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ background: template.colors.primary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ background: template.colors.secondary }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ background: template.colors.accent }}
                      />
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Spacer for floating button */}
          <div className="h-24" />
        </div>
      </div>

      {/* Floating Continue Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <button
          onClick={onContinue}
          className="px-10 md:px-14 py-4 md:py-5 bg-black text-white text-base md:text-lg font-bold rounded-full 
                     hover:bg-gray-800 active:scale-95 
                     transition-all duration-150 
                     shadow-2xl hover:shadow-3xl"
        >
          Continue to Booth →
        </button>
      </div>
    </div>
  );
}
