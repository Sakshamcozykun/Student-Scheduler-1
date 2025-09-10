/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dynamic colors using CSS custom properties
        background: 'var(--color-background, #F8EDEB)',
        surface: 'var(--color-surface, #FAE1DD)',
        accent: 'var(--color-accent, #FEC5BB)',
        muted: 'var(--color-muted, #E8E8E4)',
        border: 'var(--color-border, #D8E2DC)'
      }
    },
  },
  plugins: [],
};
