/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Montserrat, sans-serif',
      },
      colors: {
        verde: {
          100: '#00B37E',
          200: '#015F43',
          300: '#0e662d',
          600: 'rgba(0, 179, 126, 0.6)',
        },
        cinza: {
          50: '#EAF0F7',
          100: '#E1E1E6',
          200: '#C4C4CC',
          400: '#8D8D99',
          600: '#323238',
          700: '#1e1e1e',
          800: '#121214',
        },
        azul: {
          100: '#81D8F7',
        },
        laranja: {
          100: '#FBA94C',
        },
        vermelho: {
          100: '#F75A68',
        },
      },
    },
  },
  plugins: [],
};
