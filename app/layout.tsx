"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { Provider } from "react-redux";
import { store } from "@/state/store/store";
import AuthProvider from "@/context/authProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { ThemeProvider } from "@/ThemeProvider";

// Inter font setup
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use state to avoid hydration mismatch
  const [queryClient] = useState(() => new QueryClient());

  // This renders the initial HTML on the server
  // without any class modifications to prevent hydration errors
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <Provider store={store}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>{children}</ThemeProvider>
            </QueryClientProvider>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
