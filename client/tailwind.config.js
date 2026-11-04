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
        autox: {
          bg: '#080A0D',
          dark: '#15191F',
          card: '#1C222A',
          cardHover: '#232B35',
          orange: '#FF5A1F',
          orangeHover: '#E04812',
          silver: '#C5CBD3',
          text: '#FFFFFF',
          muted: '#A7AFB9',
          border: '#303741',
          accent: '#FF5A1F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Rajdhani', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(255, 90, 31, 0.3)',
        'glow-lg': '0 0 35px -5px rgba(255, 90, 31, 0.45)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
