/** @type {import("tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': [
          'Poppins',
          'Inter',
          'Roboto',
          'Proxima Nova',
          'IBM Plex Sans',
          'Montserrat',
          'Poppins', 
          'Work Sans',
          'Inter',
          'Roboto',
          'Rubik',
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