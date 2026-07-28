"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative flex h-9 w-9 items-center justify-center rounded-full glass transition-transform hover:scale-105 active:scale-95"
    >
      <Sun className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} />
      <Moon className={`absolute h-4 w-4 transition-all ${theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
    </button>
  );
}
