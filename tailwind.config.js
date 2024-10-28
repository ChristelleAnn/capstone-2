/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure you're scanning the correct files for Tailwind classes
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          100: '#ffccd5', // Light pink
          300: '#ff99a8', // Medium pink
          500: '#ff667f', // Darker pink
          700: '#ff3361', // Dark pink
        },
        maroon: '#A52A2A', // Maroon color
        teal: {
          100: '#ccf4f8', // Light teal
          300: '#99e0e7', // Medium teal
          500: '#33b2b8', // Darker teal
          700: '#009b9b', // Dark teal
        },
      },
    },
  },
  darkMode: 'class', // Enable class-based dark mode
  plugins: [],
}
