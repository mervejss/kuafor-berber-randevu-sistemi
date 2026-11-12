/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f1ff', 100: '#ece7ff', 200: '#d9d1ff', 300: '#bcaaff',
          400: '#9b7bff', 500: '#7c4dff', 600: '#6a2dfb', 700: '#5a1ee0',
          800: '#4a19b5', 900: '#3e1890'
        }
      },
      borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem' },
      boxShadow: { soft: '0 8px 30px rgba(0,0,0,0.08)' }
    },
  },
  plugins: [],
}
