// tailwind.config.js
import { breadcrumbs, heroui } from "@heroui/react";
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
        breadcrumbs: "#e4e4e7",
        breadcrumbshover: "#71717a",
        breadcrumbsborder: "#3f3f46",
        breadcrumbshoverborder: "#71717a",
        activehover: "#d63851",
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
      prefix: "heroui",
      addCommonColors: false,
      defaultTheme: "light",
      defaultExtendTheme: "light",
      layout: {},
      themes: {
        light: {
          layout: {}, // light theme layout tokens
          danger: {
            50: "#ffe5e5",
            100: "#fdb8b8",
            200: "#fa8a8a",
            300: "#f75c5c",
            400: "#f42e2e",
            500: "#f20000", // your custom red
            600: "#c20000",
            700: "#920000",
            800: "#610000",
            900: "#310000",
            foreground: "#fff",
          }, // light theme colors
        },
        dark: {
          layout: {}, // dark theme layout tokens
          colors: {
            danger: {
              50: "#ffe5e5",
              100: "#fdb8b8",
              200: "#fa8a8a",
              300: "#f75c5c",
              400: "#f42e2e",
              500: "#f20000", // your custom red
              600: "#c20000",
              700: "#920000",
              800: "#610000",
              900: "#310000",
              foreground: "#fff",
            },
          }, // dark theme colors
        },
        // ... custom themes
      },
    }),
  ],
};
