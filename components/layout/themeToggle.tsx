"use client";
import { selectDarkMode, toggleTheme } from "@/state/store/feature/themeSlice";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";

export default function ThemeToggle() {
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
      aria-label="Toggle theme"
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}
