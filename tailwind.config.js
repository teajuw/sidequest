/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          hover: '#252525',
        }
      },
      keyframes: {
        exit: {
          '0%': {
            opacity: '1',
            transform: 'scale(1) translateX(0)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.9) translateX(30px)',
          },
        },
      },
      animation: {
        exit: 'exit 0.3s ease-out forwards',
      },
    },
  },
  plugins: [],
}
