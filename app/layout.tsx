"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/state/store/store";
import AuthProvider from "@/context/authProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";

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

  // Handle dark mode
  useEffect(() => {
    const isDarkMode = localStorage.getItem("theme") === "dark";

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <AuthProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
