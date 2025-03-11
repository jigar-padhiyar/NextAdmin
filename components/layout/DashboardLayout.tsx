"use client";
import { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/state/store/hook";
import { selectDarkMode } from "@/state/store/feature/themeSlice";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import Header from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { status } = useSession();
  const router = useRouter();
  const darkMode = useAppSelector(selectDarkMode);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/pages/auth/signin/signIn");
    }
  }, [status, router]);

  // Show loading or nothing while checking authentication
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
