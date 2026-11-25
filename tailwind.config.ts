import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}', './public/**/*.{html,svg}'],
  theme: {
    extend: {
      colors: {
        // Inspirées du drapeau du Tchad
        tchad: {
          blue: {
            50: '#e8f0fb',
            100: '#c9dcf4',
            200: '#97bbe8',
            300: '#5e93d6',
            400: '#2f6cbf',
            500: '#0f4f9e',
            600: '#0a3d82',
            700: '#082f66',
            800: '#062450',
            900: '#051a3a',
            950: '#031027',
          },
          gold: {
            50: '#fff9e6',
            100: '#ffefbf',
            200: '#ffe080',
            300: '#ffd042',
            400: '#fec520',
            500: '#f2b200',
            600: '#d19400',
            700: '#a67200',
            800: '#7c5400',
            900: '#543900',
          },
          red: {
            50: '#fdecec',
            100: '#f9d3d3',
            200: '#f2a3a3',
            300: '#e86a6a',
            400: '#d93a3a',
            500: '#c8102e',
            600: '#a80c26',
            700: '#85091e',
            800: '#630716',
            900: '#42050f',
          },
        },
        paper: {
          50: '#fdfbf6',
          100: '#f8f3e7',
          200: '#efe4cc',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Source Sans 3', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(6, 36, 80, 0.18)',
        card: '0 4px 18px -6px rgba(6, 36, 80, 0.15)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideSlogan: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '12%': { opacity: '1', transform: 'translateY(0)' },
          '85%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-14px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn .5s ease-out both',
        slogan: 'slideSlogan 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
