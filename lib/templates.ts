// Photo strip template types and configurations

export interface PhotoStripTemplate {
  id: string;
  name: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  borderStyle: {
    width: number;
    color: string;
    pattern: 'solid' | 'dashed' | 'perforated' | 'glow';
  };
  decorations: {
    type: 'none' | 'confetti' | 'hearts' | 'film' | 'neon' | 'polaroid';
    intensity: number; // 0-1, how many decorations to show
  };
  textArea: {
    enabled: boolean;
    placeholder: string;
    font: string;
    color: string;
  };
}

// 6 Pre-configured templates
export const PHOTO_STRIP_TEMPLATES: PhotoStripTemplate[] = [
  // 1. Classic Black & White
  {
    id: 'classic',
    name: 'Classic',
    description: 'Timeless black & white',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#666666',
      background: '#FFFFFF',
    },
    borderStyle: {
      width: 3,
      color: '#000000',
      pattern: 'solid',
    },
    decorations: {
      type: 'confetti',
      intensity: 0.3,
    },
    textArea: {
      enabled: true,
      placeholder: 'Date',
      font: 'Arial, sans-serif',
      color: '#666666',
    },
  },

  // 2. Birthday Party
  {
    id: 'birthday',
    name: 'Birthday Party',
    description: 'Celebration in monochrome',
    colors: {
      primary: '#111111',
      secondary: '#F3F4F6',
      accent: '#6B7280',
      background: '#FFFFFF',
    },
    borderStyle: {
      width: 5,
      color: '#111111',
      pattern: 'solid',
    },
    decorations: {
      type: 'hearts',
      intensity: 0.5,
    },
    textArea: {
      enabled: true,
      placeholder: 'Celebrate',
      font: 'Arial, sans-serif',
      color: '#111111',
    },
  },

  // 3. Love & Hearts
  {
    id: 'love',
    name: 'Love & Hearts',
    description: 'Clean monochrome style',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#9CA3AF',
      background: '#F9FAFB',
    },
    borderStyle: {
      width: 4,
      color: '#000000',
      pattern: 'solid',
    },
    decorations: {
      type: 'hearts',
      intensity: 0.6,
    },
    textArea: {
      enabled: true,
      placeholder: 'Memories',
      font: 'Georgia, serif',
      color: '#111111',
    },
  },

  // 4. Vintage Film
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Film strip in grayscale',
    colors: {
      primary: '#1F2937',
      secondary: '#F9FAFB',
      accent: '#4B5563',
      background: '#FFFFFF',
    },
    borderStyle: {
      width: 0,
      color: '#1F2937',
      pattern: 'perforated',
    },
    decorations: {
      type: 'film',
      intensity: 1,
    },
    textArea: {
      enabled: true,
      placeholder: 'Classic Film',
      font: 'Courier New, monospace',
      color: '#1F2937',
    },
  },

  // 5. Neon Glow
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'High-contrast monochrome',
    colors: {
      primary: '#111111',
      secondary: '#E5E7EB',
      accent: '#6B7280',
      background: '#F3F4F6',
    },
    borderStyle: {
      width: 3,
      color: '#111111',
      pattern: 'glow',
    },
    decorations: {
      type: 'neon',
      intensity: 0.7,
    },
    textArea: {
      enabled: true,
      placeholder: 'Sharp Contrast',
      font: 'Arial, sans-serif',
      color: '#111111',
    },
  },

  // 6. Polaroid Style
  {
    id: 'polaroid',
    name: 'Polaroid',
    description: 'Instant camera classic',
    colors: {
      primary: '#FFFFFF',
      secondary: '#FFFEF0',
      accent: '#333333',
      background: '#F8F8F8',
    },
    borderStyle: {
      width: 20,
      color: '#FFFFFF',
      pattern: 'solid',
    },
    decorations: {
      type: 'polaroid',
      intensity: 1,
    },
    textArea: {
      enabled: true,
      placeholder: 'Write a caption...',
      font: 'Comic Sans MS, cursive',
      color: '#333333',
    },
  },
];

// Helper function to get template by ID
export function getTemplateById(id: string): PhotoStripTemplate | undefined {
  return PHOTO_STRIP_TEMPLATES.find((template) => template.id === id);
}

// Default template
export const DEFAULT_TEMPLATE = PHOTO_STRIP_TEMPLATES[0]; // Classic
