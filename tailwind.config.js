const colors = require("./src/constants/_colors.js");

/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        PrimaryMedium: ["PrimaryMedium"],
        PrimaryText: ["PrimaryText"],
      },
      colors: colors,
    },
  },
  plugins: [],
};
