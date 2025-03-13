"use client";
import { ReactNode, useEffect, lazy, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useAppSelector } from "@/state/store/hook";
import { selectDarkMode } from "@/state/store/feature/themeSlice";
import { useRouter } from "next/navigation";

// Lazy load components
const Sidebar = lazy(() => import("./sidebar"));
const Header = lazy(() => import("./header"));

// Loading fallbacks
const HeaderSkeleton = () => (
  <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 w-full animate-pulse"></div>
);

const SidebarSkeleton = () => (
  <div className="w-64 hidden md:block bg-white dark:bg-gray-800 h-full border-r border-gray-200 dark:border-gray-700 animate-pulse">
    <div className="p-4">
      <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
      <div className="space-y-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-6 w-full bg-gray-200 dark:bg-gray-700 rounded"
          ></div>
        ))}
      </div>
    </div>
  </div>
);

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
      router.push("/pages/auth/signin");
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
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>
        <div className="flex flex-1">
          <Suspense fallback={<SidebarSkeleton />}>
            <Sidebar />
          </Suspense>
          <main className="flex-1 p-4 md:p-6 overflow-auto max-sm:pl-20 max-sm:mt-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
