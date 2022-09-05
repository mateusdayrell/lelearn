/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.js'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Montserrat, sans-serif'
      },
      colors: {
        verde:{
          100: '#1fd660',
          200: '#18a84b',
          300: '#0e662d',
        }
      }
    },
  },
  plugins: [],
}
