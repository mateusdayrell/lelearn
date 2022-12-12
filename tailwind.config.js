/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.js'],
  theme: {
    screens: {
      sm: '400px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
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
          350: '#343438',
          400: '#28282c',
          500: '#1f1f23',
          600: '#3f3b66',
        },
        azul: {
          100: '#81D8F7',
          200: '#39606e',
        },
        laranja: {
          100: '#FBA94C',
          200: '#6d4b24',
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
