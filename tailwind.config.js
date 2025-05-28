// tailwind.config.js
import { heroui } from "@heroui/react";
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgprimary: "#000000",
        bgprimaryhover: "#277c9c",
        titletext: "#3F3D56",
        active: "#ef4660",
        text: "#184c5f",
        hoverbackground: "#F05366",
        lineBg: "#184cg5",
      },
    },
    keyframes: {
      "fade-in-out": {
        "0%": { opacity: "0" },
        "50%": { opacity: "1" },
        "100%": { opacity: "0" },
      },
    },
    animation: {
      "fade-in-out": "fade-in-out 2s infinite",
    },

    fontFamily: {
      Poppins: ["Poppins", "sans-serif"],
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      layout: {
        boxShadow: {
          small: "0px 4px 8px rgba(0,0,0,1)",
          medium: "0px 8px 16px rgba(0,0,0,1)",
          large: "0px 16px 24px rgba(0,0,0,1)",
        },
      },
    }),
  ],
};
