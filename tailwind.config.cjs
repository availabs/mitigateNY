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
          'Proxima Nova'
        ],
        'display': [
          'Oswald'
        ]
      },
    },
  },
  plugins: [],
}