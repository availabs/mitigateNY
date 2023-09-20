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
        'sans': ['Proxima Nova','IBM Plex Sans','Inter','Roboto','Work Sans', ...defaultTheme.fontFamily.sans],
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