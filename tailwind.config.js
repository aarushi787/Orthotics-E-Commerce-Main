// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ["Inter", "sans-serif"],
//       },
//       colors: {
//         brand: {
//           primary: "#03A688",       // Main teal
//           secondary: "#04BFBF",     // Aqua teal
//           highlight: "#05C7F2",     // Bright cyan
//           light: "#E3F8FF",         // Soft cyan background
//           success: "#03A64A",       // Green badge
//           dark: "#0D0D0D",          // Neutral black

//           // Shades (optional)
//           50: "#E6F6F5",
//           100: "#C0E8E3",
//           200: "#8AD4CA",
//           300: "#54C0B2",
//           400: "#2EAB9E",
//           500: "#03A688",
//           600: "#02846D",
//           700: "#026053",
//           800: "#013C38",
//           900: "#011E1D",
//         },
//       },
//     },
//   },
//   plugins: [],
// };

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          teal: {
            50:  "#EAF3F4",
            100: "#D5E6EA",
            200: "#ACCDD4",
            300: "#82B4BF",
            400: "#599BA9",
            500: "#2F8294", // ⭐ base poster color
            600: "#2A7585",
            700: "#215B68",
            800: "#14373F",
            900: "#050D0F",
          },

          accent: {
            400: "#5ED6EE",
            500: "#4ACDE9",
            600: "#33B4CF",
          },

          success: "#03A64A",
          dark: "#0D0D0D",
        },
      },
    },
  },
  plugins: [],
};
