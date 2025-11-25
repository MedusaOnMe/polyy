/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Terminal blacks
        'term-black': '#0a0a0a',
        'term-dark': '#111111',
        'term-gray': '#1a1a1a',
        'term-border': '#2a2a2a',
        // Phosphor green palette
        'term-green': '#00ff41',
        'term-green-dim': '#00cc33',
        'term-green-dark': '#003300',
        // Terminal amber for warnings/accents
        'term-amber': '#ffb000',
        'term-amber-dim': '#cc8800',
        // Red for errors/shorts
        'term-red': '#ff0040',
        'term-red-dim': '#cc0033',
        // Cyan for info
        'term-cyan': '#00ffff',
        // Text
        'term-text': '#b0b0b0',
        'term-text-dim': '#606060',
      },
      fontFamily: {
        mono: ['"IBM Plex Mono"', '"SF Mono"', 'Monaco', 'Consolas', 'monospace'],
      },
      animation: {
        'blink': 'blink 1s step-end infinite',
        'scanline': 'scanline 8s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'flicker': 'flicker 0.15s infinite',
      },
      keyframes: {
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'flicker': {
          '0%': { opacity: '0.97' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.98' },
        },
      },
    },
  },
  plugins: [],
}
