import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/react";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Function to get initial theme
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("heroui-theme");
  if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
    return savedTheme;
  }

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }

  return "light";
};

// Set initial theme
const initialTheme = getInitialTheme();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <HeroUIProvider defaultTheme={initialTheme}>
      <App />
    </HeroUIProvider>
  </BrowserRouter>
);
