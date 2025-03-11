"use client";

import { Inter } from "next/font/google"; // Fallback to Inter or another Google Font
// Alternatively, use the Vercel Fonts package if you have it installed
// import { GeistSans, GeistMono } from '@vercel/fonts';
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/state/store/store";
import AuthProvider from "@/context/authProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { setLightTheme, setDarkTheme } from "@/state/store/feature/themeSlice";
import { useAppDispatch } from "@/state/store/hook";

// Option 1: Use Inter as a fallback Google Font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Option 2: If you have Geist font files locally, use next/font/local
// import localFont from 'next/font/local';
// const geistSans = localFont({
//   src: [
//     {
//       path: '../path-to-your-fonts/GeistSans-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     // Add other weights as needed
//   ],
//   variable: '--font-geist-sans',
// });
//
// const geistMono = localFont({
//   src: [
//     {
//       path: '../path-to-your-fonts/GeistMono-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     // Add other weights as needed
//   ],
//   variable: '--font-geist-mono',
// });

// Option 3: If you have @vercel/fonts installed
// Use the import at the top of the file

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={`${inter.variable}`}>
      {/* If using Vercel Fonts: className={`${GeistSans.variable} ${GeistMono.variable}`} */}
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
