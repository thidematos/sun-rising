/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#7cbde8',
        terciary: '#1f74ac',
        grayDegree: 'rgb(73,80,87)',
        almostWhite: 'rgb(241,243,245)',
        contrast: '#DB9735',
      },
      fontFamily: {
        typeMarck: 'Marck Script',
        typePoppins: 'Poppins',
      },
    },
  },
  plugins: [],
};
