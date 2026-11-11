/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E60023',
          white: '#FFFFFF',
          black: '#000000',
          offwhite: '#F4F4F4',
        },
      },
      fontFamily: {
        modern: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'sans-serif'],
        cursive: ['"Playfair Display"', 'serif'],
      },
      borderWidth: {
        3: '3px',
        4: '4px',
      },
      boxShadow: {
        'max-black': '6px 6px 0px 0px #000000',
        'max-red': '6px 6px 0px 0px #E60023',
        'max-white': '6px 6px 0px 0px #FFFFFF',
      },
    },
  },
  plugins: [],
};