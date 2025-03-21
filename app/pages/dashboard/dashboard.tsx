"use client";

import { useEffect, useState, lazy, Suspense } from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchPosts, selectAllPosts } from "@/state/store/feature/postSlice";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import { fetchUsers, selectAllUsers } from "@/state/store/feature/userSlice";

// Lazy load components
const RecentActivity = lazy(
  () => import("@/components/dashboard/RecentActivity")
);
const DashboardCharts = lazy(() => import("@/components/dashboard/DataChart"));

// Loading fallbacks
const ChartsSkeleton = () => (
  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
);

const ActivitySkeleton = () => (
  <div className="w-full h-90 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>
);

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const posts = useAppSelector(selectAllPosts);

  // State to toggle between random and API data
  const [useRandomData, setUseRandomData] = useState(false);

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | Admin Panel</title>
      </Head>

      <div className="mb-6">
        <h1
          className="text-2xl font-bold text-gray-900 
             dark:text-white"
        >
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-300">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Data source toggle */}
      <div className="mb-4">
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={!useRandomData}
            onChange={() => setUseRandomData(!useRandomData)}
          />
          <div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:translate-x-[-100%] after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {useRandomData ? "Use API Data" : "Using API Data"}
          </span>
        </label>
      </div>

      {/* Enhanced dashboard charts with lazy loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Suspense fallback={<ChartsSkeleton />}>
          <DashboardCharts
            useRandomData={useRandomData}
            apiData={!useRandomData ? { users, posts } : undefined}
          />
        </Suspense>

        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity posts={posts.slice(0, 5)} users={users.slice(0, 5)} />
        </Suspense>
      </div>
    </DashboardLayout>
  );
}
