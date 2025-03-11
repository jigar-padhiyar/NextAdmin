"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import {
  fetchUsers,
  selectAllUsers,
  selectUsersStatus,
} from "@/state/store/feature/userSlice";
import DashboardLayout from "@/components/layout/DashboardLayout";
import DraggableUserList from "@/components/users/DraggableUserList";
import Pagination from "@/components/ui/Pagination";

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
  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
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

        <div className="mt-4 md:mt-0">
          <button
            type="button"
            className="px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-gray-900 dark:text-white"
          >
            Add New User
          </button>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <DraggableUserList users={currentUsers} />
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
