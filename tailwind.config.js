// tailwind.config.js
const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgprimary: "#184C5F",
        bgprimaryhover: "#277c9c",
        active: "#f3817e",
        secondary: "#f3817e",
      },
    },
    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
