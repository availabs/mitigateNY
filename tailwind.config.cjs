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

         "span-13": "span 13 / span 13",
         "span-14": "span 14 / span 14",
         "span-15": "span 15 / span 15",
         "span-16": "span 16 / span 16",
         "span-17": "span 17 / span 17",
         "span-18": "span 18 / span 18",
         "span-19": "span 19 / span 19",
         "span-20": "span 20 / span 20",
         "span-21": "span 21 / span 21",
         "span-22": "span 22 / span 22",
         "span-23": "span 23 / span 23",
         "span-24": "span 24 / span 24"
      }
    },
  },
  plugins: [],
}