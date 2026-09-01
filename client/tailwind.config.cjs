/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Remapped to the IPMC Design System (Ink / Signal / Brass) —
        // see docs/DESIGN_SYSTEM.md. Reusing the existing `primary`/`accent`
        // token names means every component that already references
        // bg-primary-900, text-accent-500, etc. picks up the new palette
        // automatically, with no per-component edits required.
        primary: {
          50: '#eef2fb',
          100: '#e4ebfb',
          200: '#c7d6f5',
          300: '#8fa8e8',
          400: '#5c7fd1',
          500: '#2451c4',  // Signal — primary action blue
          600: '#1d3fa0',
          700: '#1e3a6e',
          800: '#152a52',
          900: '#0f1d3d',
          950: '#0b1830',  // Ink — primary dark
        },
        accent: {
          50: '#fbf3e7',
          100: '#f7e9d2',
          200: '#efd3a5',
          300: '#e3b876',
          400: '#d6a050',
          500: '#c8862b',  // Brass — CTAs, highlights, stamp mark
          600: '#a66e20',
          700: '#8a5a1a',
          800: '#6e4715',
          900: '#4a2f0e',
        },
        verified: {
          50: '#dcfce7',
          500: '#15803d',  // Compliance/certified marks only — use sparingly
          600: '#116430',
        },
        dark: '#0b1830',
        light: '#f4f6f9',
      },
      fontFamily: {
        // Body/UI — an engineering-house grotesk, not a generic startup sans
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        // Headlines only — an engraved editorial serif, used with restraint
        display: ['Fraunces', 'Georgia', 'serif'],
        // Every stat, metric and data figure on the site sets in mono —
        // a deliberate, consistent signal that a number here is measured,
        // not marketing copy.
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'stamp-spin': 'stampSpin 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        stampSpin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': "url('/assets/images/hero-bg.jpg')",
      },
    },
  },
  plugins: [],
}
