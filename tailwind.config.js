/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00ff9d',
        'secondary': '#0066cc',
        'dark': '#121212',
        'card-bg': '#1e1e1e',
      },
    },
  },
  plugins: [],
} 