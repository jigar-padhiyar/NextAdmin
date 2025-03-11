"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/state/store/store";
import AuthProvider from "@/context/authProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { setLightTheme, setDarkTheme } from "@/state/store/feature/themeSlice";
import { useAppDispatch } from "@/state/store/hook";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ThemeInitializer />
              {children}
            </QueryClientProvider>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}

// Separate component to handle theme initialization
function ThemeInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize theme state from localStorage on first load
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    // Set the theme based on localStorage or system preference
    const isDarkMode =
      savedTheme === "dark" || (savedTheme === null && prefersDark);

    // Update Redux store using existing actions
    if (isDarkMode) {
      dispatch(setDarkTheme());
    } else {
      dispatch(setLightTheme());
    }

    // Initial classes will be applied by the ThemeToggle component's effect
  }, [dispatch]);

  return null;
}
