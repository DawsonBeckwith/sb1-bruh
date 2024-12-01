/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        green: {
          400: '#4ade80',
          500: '#22c55e',
          900: '#14532d'
        },
        zinc: {
          400: '#a1a1aa',
          500: '#71717a',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b'
        }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'slide': 'slide 2s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};