import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      bg: '#f0eeeb',
      ink: '#111111',
      ink2: '#333333',
      'gray-border': '#c8c4be',
      'gray-slot': '#e8e5e0',
      accent: '#e03030',
      green: '#2d9e4f',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'green-25': 'rgba(45, 158, 79, 0.25)',
    },
    fontFamily: {
      caveat: ['Caveat', 'cursive'],
      patrick: ['Patrick Hand', 'cursive'],
    },
    extend: {},
  },
  plugins: [],
};

export default config;
