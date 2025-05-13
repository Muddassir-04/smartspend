/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue for buttons, accents
        secondary: '#2DD4BF', // Teal for hover effects
        background: '#F3F4F6', // Light gray background
        navbar: '#1E3A8A', // Dark blue for navbar
        textMain: '#1F2937', // Dark gray for text
      },
    },
  },
  plugins: [],
}
