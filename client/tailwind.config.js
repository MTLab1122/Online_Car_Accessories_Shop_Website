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
          surface: '#101318',
          card: '#15191F',
          cardHover: '#1C222A',
          dark: '#0D1015',
          orange: '#FF5A1F',
          orangeHover: '#E04812',
          orangeMuted: 'rgba(255, 90, 31, 0.15)',
          silver: '#C5CBD3',
          text: '#F5F5F5',
          muted: '#9299A3',
          border: '#1E232B',
          borderLight: '#2C333D',
          accent: '#FF5A1F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(255, 90, 31, 0.25)',
        'glow': '0 0 25px -5px rgba(255, 90, 31, 0.35)',
        'glow-lg': '0 0 40px -5px rgba(255, 90, 31, 0.5)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'card-hover': '0 20px 40px -15px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

