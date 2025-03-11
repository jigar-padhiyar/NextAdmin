"use client";

import { useEffect } from "react";
import Head from "next/head";
import OverviewStats from "@/components/dashboard/OverviewStats";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { fetchPosts, selectAllPosts } from "@/state/store/feature/postSlice";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import { fetchUsers, selectAllUsers } from "@/state/store/feature/userSlice";

export default function Dashboard() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const posts = useAppSelector(selectAllPosts);
  const savedTheme = useAppSelector((state) => state.theme.darkMode);

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
          className={`text-2xl font-bold text-gray-900 ${
            savedTheme && "text-white"
          }`}
        >
          Dashboard
        </h1>
        <p className={`text-gray-500  ${savedTheme && "text-gray-300"} `}>
          Welcome to your admin dashboard
        </p>
      </div>

      <OverviewStats usersCount={users.length} postsCount={posts.length} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"></div>
    </DashboardLayout>
  );
}
