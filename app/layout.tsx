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

// Create a separate ThemeInitializer component with ThemeProvider
// to avoid hydration mismatch and component nesting issues
function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryClientProvider>
      </Provider>
    </AuthProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This renders the initial HTML on the server
  // without any class modifications to prevent hydration errors
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {mounted ? (
          <AppProviders>{children}</AppProviders>
        ) : (
          // This is a simplified version for server rendering
          // that will be replaced on client hydration
          <div style={{ visibility: "hidden" }}>{children}</div>
        )}
      </body>
    </html>
  );
}
