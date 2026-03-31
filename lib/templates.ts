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
      type: 'none',
      intensity: 0,
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
    description: 'Fun & colorful celebration',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      accent: '#FFE66D',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    borderStyle: {
      width: 5,
      color: '#FF6B6B',
      pattern: 'solid',
    },
    decorations: {
      type: 'confetti',
      intensity: 0.8,
    },
    textArea: {
      enabled: true,
      placeholder: 'Happy Birthday!',
      font: 'Comic Sans MS, cursive, sans-serif',
      color: '#FFFFFF',
    },
  },

  // 3. Love & Hearts
  {
    id: 'love',
    name: 'Love & Hearts',
    description: 'Romantic pink vibes',
    colors: {
      primary: '#FF69B4',
      secondary: '#FFB6C1',
      accent: '#FF1744',
      background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E1 100%)',
    },
    borderStyle: {
      width: 4,
      color: '#FF69B4',
      pattern: 'solid',
    },
    decorations: {
      type: 'hearts',
      intensity: 0.6,
    },
    textArea: {
      enabled: true,
      placeholder: 'With Love',
      font: 'Georgia, serif',
      color: '#FF1744',
    },
  },

  // 4. Vintage Film
  {
    id: 'vintage',
    name: 'Vintage Film',
    description: 'Retro film strip style',
    colors: {
      primary: '#704214',
      secondary: '#F5DEB3',
      accent: '#8B4513',
      background: '#FFFEF0',
    },
    borderStyle: {
      width: 0,
      color: '#704214',
      pattern: 'perforated',
    },
    decorations: {
      type: 'film',
      intensity: 1,
    },
    textArea: {
      enabled: true,
      placeholder: 'August 2026',
      font: 'Courier New, monospace',
      color: '#704214',
    },
  },

  // 5. Neon Glow
  {
    id: 'neon',
    name: 'Neon Glow',
    description: 'Cyberpunk aesthetic',
    colors: {
      primary: '#00FFFF',
      secondary: '#FF00FF',
      accent: '#FFFF00',
      background: '#0A0A0A',
    },
    borderStyle: {
      width: 3,
      color: '#00FFFF',
      pattern: 'glow',
    },
    decorations: {
      type: 'neon',
      intensity: 0.7,
    },
    textArea: {
      enabled: true,
      placeholder: 'NEON VIBES',
      font: 'Impact, sans-serif',
      color: '#00FFFF',
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
