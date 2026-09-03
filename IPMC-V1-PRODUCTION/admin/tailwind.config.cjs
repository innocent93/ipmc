/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff', 100: '#e0e9ff', 200: '#c2d4ff', 300: '#93b3ff',
          400: '#5c87ff', 500: '#1a56db', 600: '#1e40af', 700: '#1e3a8a',
          800: '#1e2d5c', 900: '#0f1d3d', 950: '#080f24',
        },
        accent: { 400: '#fbbf24', 500: '#d97706' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
