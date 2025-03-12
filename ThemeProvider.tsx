"use client";
import { useEffect } from "react";
import { useAppSelector } from "@/state/store/hook";
import { selectDarkMode } from "@/state/store/feature/themeSlice";

export function ThemeProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const darkMode = useAppSelector(selectDarkMode);

  // Apply theme class to html element as soon as component mounts
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  return <>{children}</>;
}
