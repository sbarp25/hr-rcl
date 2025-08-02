import React, { useEffect } from "react";
import { useTheme } from "@heroui/use-theme";

export default function ThemeProvider({ children }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme, "text-foreground", "bg-background");
  }, [theme]);

  return children;
}
