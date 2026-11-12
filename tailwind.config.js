/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f4f1ff', 100: '#ebe5ff', 200: '#d7cdff', 300: '#b8a4ff',
          400: '#9570ff', 500: '#7c4dff', 600: '#6a2dfb', 700: '#5a1ee0',
          800: '#4a19b5', 900: '#3e1890', 950: '#260f63'
        },
      },
      borderRadius: { '2xl': '1.25rem', '3xl': '1.75rem', '4xl': '2.25rem' },
      boxShadow: {
        soft: '0 8px 30px rgba(17, 12, 46, 0.08)',
        softer: '0 2px 10px rgba(17, 12, 46, 0.06)',
        glow: '0 10px 40px -8px rgba(124, 77, 255, 0.55)',
        glowRose: '0 10px 30px -8px rgba(244, 63, 94, 0.55)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: 0, transform: 'scale(0.94)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        popIn: { '0%': { opacity: 0, transform: 'scale(0.5)' }, '70%': { transform: 'scale(1.08)' }, '100%': { opacity: 1, transform: 'scale(1)' } },
        ringPulse: { '0%': { boxShadow: '0 0 0 0 rgba(244,63,94,0.45)' }, '100%': { boxShadow: '0 0 0 22px rgba(244,63,94,0)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.35s ease-out both',
        slideUp: 'slideUp 0.35s cubic-bezier(.22,1,.36,1) both',
        scaleIn: 'scaleIn 0.25s cubic-bezier(.22,1,.36,1) both',
        popIn: 'popIn 0.5s cubic-bezier(.22,1,.36,1) both',
        ringPulse: 'ringPulse 1.6s cubic-bezier(0,0,.2,1) infinite',
        shimmer: 'shimmer 1.8s infinite linear',
        float: 'float 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
