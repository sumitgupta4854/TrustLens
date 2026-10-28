/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // New Midnight Teal + Warm Coral Design System
        midnight: {
          950: '#101C22', // Midnight background
          900: '#18272D', // Dark surface
          850: '#22363C', // Elevated dark surface
          800: '#2B4249',
          700: '#30464B', // Dark border
        },
        lightbg: {
          50: '#FFFFFF',
          100: '#F5F8F7', // Light background
          200: '#EBF1F0',
          300: '#DFE9E6', // Light border
        },
        teal: {
          50: '#F0FAF8',
          100: '#D9F5EE', // Soft mint
          200: '#B2EADE',
          300: '#75D8C7',
          400: '#3EC5B3',
          500: '#19B7A5', // Primary teal
          600: '#139B8B',
          700: '#087F73', // Deep teal
          800: '#065F56',
          900: '#04423C',
        },
        coral: {
          50: '#FFF2F0',
          100: '#FFE2DE',
          200: '#FFC6BE',
          300: '#FFA496',
          400: '#FF806D', // Coral accent
          500: '#F86752',
          600: '#DC4C37',
          700: '#B73724',
        },
        txt: {
          lightPrimary: '#1B2B30',
          lightSecondary: '#687B7F',
          darkPrimary: '#F3F8F7',
          darkSecondary: '#B4C5C5',
        },
        concern: {
          lowBg: 'rgba(25, 183, 165, 0.12)',
          lowText: '#087F73',
          lowBorder: '#19B7A5',
          modBg: 'rgba(245, 158, 11, 0.12)',
          modText: '#D97706',
          modBorder: '#F59E0B',
          highBg: 'rgba(255, 128, 109, 0.12)',
          highText: '#DC4C37',
          highBorder: '#FF806D',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft-sm': '0 1px 3px 0 rgba(16, 28, 34, 0.05), 0 1px 2px -1px rgba(16, 28, 34, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(16, 28, 34, 0.07), 0 2px 4px -2px rgba(16, 28, 34, 0.07)',
        'soft-lg': '0 10px 15px -3px rgba(16, 28, 34, 0.08), 0 4px 6px -4px rgba(16, 28, 34, 0.08)',
        'soft-xl': '0 20px 25px -5px rgba(16, 28, 34, 0.1), 0 8px 10px -6px rgba(16, 28, 34, 0.1)',
        'glow-teal': '0 0 25px -5px rgba(25, 183, 165, 0.25)',
        'glow-coral': '0 0 25px -5px rgba(255, 128, 109, 0.25)',
      },
    },
  },
  plugins: [],
}
