/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0d1117',
        secondary: '#161b22',
        tertiary: '#21262d',
        border: '#30363d',
        'text-primary': '#f0f6fc',
        'text-secondary': '#8b949e',
        'accent-green': '#00d26a',
        'accent-red': '#ff3b69',
        'accent-blue': '#58a6ff',
        'accent-purple': '#a855f7',
        'accent-yellow': '#f59e0b',
      },
      fontFamily: {
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulse-green 0.5s ease-out',
        'pulse-red': 'pulse-red 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-green': {
          '0%': { backgroundColor: 'rgba(0, 210, 106, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'pulse-red': {
          '0%': { backgroundColor: 'rgba(255, 59, 105, 0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
