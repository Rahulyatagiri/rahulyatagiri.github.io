/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peak: {
          dark: '#0f1623',
          navy: '#1a2535',
          blue: '#1e3a5f',
          accent: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          muted: '#64748b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
