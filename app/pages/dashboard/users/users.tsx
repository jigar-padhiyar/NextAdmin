"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import {
  fetchUsers,
  selectAllUsers,
  selectUsersStatus,
} from "@/state/store/feature/userSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Lazy load components
const DraggableUserList = lazy(
  () => import("@/components/users/DraggableUserList")
);
const Pagination = lazy(() => import("@/components/ui/Pagination"));

// Loading fallbacks
const UserListSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="mb-4 flex items-center pt-4">
          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600"></div>
          <div className="ml-4 flex-1">
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-600 rounded"></div>
            <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mt-2"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaginationSkeleton = () => (
  <div className="mt-4 flex justify-center">
    <div className="h-8 w-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
  </div>
);

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const status = useAppSelector(selectUsersStatus);
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // Get current page users
  const indexOfFirstUser = (page - 1) * usersPerPage;
  const indexOfLastUser = indexOfFirstUser + usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  return (
    <DashboardLayout>
      <Head>
        <title>Users | Admin Panel</title>
      </Head>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize users
          </p>
        </div>
      </div>

      {status === "loading" ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : status === "failed" ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading users. Please try again.
        </div>
      ) : (
        <>
          <Suspense fallback={<UserListSkeleton />}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              <DraggableUserList
                users={currentUsers}
                startIndex={indexOfFirstUser} // Pass the start index
              />
            </div>
          </Suspense>

          <Suspense fallback={<PaginationSkeleton />}>
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </Suspense>
        </>
      )}
    </DashboardLayout>
  );
}
