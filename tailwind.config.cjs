/** @type {import("tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  mode: 'jit',
  darkMode: 'class', //'media',
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
          
          ...defaultTheme.fontFamily.sans
        ],
        'display': [
          'Proxima Nova',
          ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}