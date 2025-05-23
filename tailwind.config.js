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
        primary: {
          50: '#E6EDFF',
          100: '#CCDAFF',
          200: '#99B5FF',
          300: '#6690FF',
          400: '#336BFF',
          500: '#3366FF', // Main primary color
          600: '#0047FF',
          700: '#0033CC',
          800: '#002299',
          900: '#001166',
        },
        accent: {
          50: '#E6F7F1',
          100: '#CCEFE3',
          200: '#99DFC7',
          300: '#66CFAB',
          400: '#36BF8F',
          500: '#36B37E', // Main accent color
          600: '#2D9267',
          700: '#246E50',
          800: '#1B4B39',
          900: '#123023',
        },
        warning: {
          50: '#FFF5E6',
          100: '#FFEACC',
          200: '#FFD699',
          300: '#FFC166',
          400: '#FFAD33',
          500: '#FFAB00', // Main warning color
          600: '#CC8900',
          700: '#996700',
          800: '#664400',
          900: '#332200',
        },
        error: {
          50: '#FFEBE6',
          100: '#FFD6CC',
          200: '#FFAD99',
          300: '#FF8466',
          400: '#FF5A33',
          500: '#FF5630', // Main error color
          600: '#CC3B20',
          700: '#992C18',
          800: '#661E10',
          900: '#330F08',
        },
        neutral: {
          50: '#F7F9FC',
          100: '#EDF2FC',
          200: '#DFE7F5',
          300: '#CFD7E3',
          400: '#B2C0D3',
          500: '#8998AD',
          600: '#5E6C84',
          700: '#4D5B73',
          800: '#333D51',
          900: '#172136',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};