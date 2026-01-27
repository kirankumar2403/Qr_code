/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        pulseGlow: {
          '0%,100%': {
            boxShadow: '0 0 0 0 rgba(99,102,241,0.35)'
          },
          '50%': {
            boxShadow: '0 0 30px 0 rgba(99,102,241,0.55)'
          }
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' }
        },
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        shimmer: 'shimmer 6s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        orbit: 'orbit 12s linear infinite',
      },
      boxShadow: {
        glow: '0 0 0 3px rgba(99,102,241,0.35)',
        'inner-strong': 'inset 0 2px 12px rgba(0,0,0,0.35)'
      },
    },
  },
  plugins: [],
};
