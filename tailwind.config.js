
const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./src/popup-page/popup.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      poppins: ["Poppins"],
    },
    extend: {
      fontSize: {
        '2xs': '.65rem',
        '3xs': '.50rem',
      },
      colors: {
        clubred: {
          dark: "#fd3662",
          light: "#f26a87",
        },
      },
      animation: {
        'pulse-slow-3': 'pulse 3s linear infinite',
        'pulse-slow-1': 'pulse 1s linear infinite',
        'pulse-slow-2': 'pulse 2s linear infinite',
       },

    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    }
  },
  plugins: [
    // plugin(function ({ addUtilities }) {
    //   const newUtilities = {
    //     '.h-1\/12': {
    //       height: "8.33333333333%",
    //     },
    //     ".h-2\/12": {
    //       height: "16.6666666667%",
    //     },
    //     ".h-3\/12": {
    //       height: "25%",
    //     },
    //     ".h-4\/12": {
    //       height: "33.3333333333%",
    //     },
    //     ".h-5\/12": {
    //       height: "41.6666666667%",
    //     },
    //     ".h-6\/12": {
    //       height: "50%",
    //     },
    //     ".h-7\/12": {
    //       height: "58.3333333333%",
    //     },
    //     ".h-8\/12": {
    //       height: "66.6666666667%",
    //     },
    //     ".h-9\/12": {
    //       height: "75%",
    //     },
    //     ".h-10\/12": {
    //       height: "83.3333333333%",
    //     },
    //     ".h-11\/12": {
    //       height: "91.6666666667%",
    //     },
    //   };

    //   addUtilities(newUtilities);
    // }),
  ],
};
