"use client";
import { selectDarkMode, toggleTheme } from "@/state/store/feature/themeSlice";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import { useEffect } from "react";

export default function ThemeToggle() {
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();

  // Update document classes when darkMode state changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
