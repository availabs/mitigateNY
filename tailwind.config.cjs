/** @type {import("tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          'Figtree',
          'Poppins',
          'Rubik',
          'Proxima Nova',
          
          ...defaultTheme.fontFamily.sans],

        'display': [
          'Rubik',
          'Montserrat',
          'Inter',
          'Roboto',
          'Proxima Nova',
          'Poppins',
          'Oswald',
          'Rubik',
          'Roboto',
          'IBM Plex Sans',
          ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        "footer": "1fr 190px 190px 190px 190px 190px 190px 1fr",
      },
       gridColumn: {

      }
    },
  },
  plugins: [],
}