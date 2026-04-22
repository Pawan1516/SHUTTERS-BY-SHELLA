/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0066cc',
        'brand-gold': '#d4af37',
        'dark-bg': '#000000',
        'deep-blue': '#001a33',
      },
      fontFamily: {
        'heading': ['Inter', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'body': ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
