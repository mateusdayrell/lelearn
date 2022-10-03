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
          100: '#F3F4F6',
          200: '#C4C4CC',
          300: '#8D8D99',
          400: '#1f1f23',
          500: '#18181b',
        },
        azul: {
          100: '#81D8F7',
        },
        laranja: {
          100: '#FBA94C',
        },
        vermelho: {
          100: '#F75A68',
          200: '#A93E47',
        },
        roxo: {
          100: '#633BBC',
        }
      },
    },
  },
  plugins: [],
};
