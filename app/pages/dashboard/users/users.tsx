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

const CompanyFilter = ({
  companies,
  value,
  onChange,
}: {
  companies: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <div className="relative w-full sm:w-64 lg:w-72">
      <label
        htmlFor="companyFilter"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Filter by Company
      </label>
      <div className="relative">
        <select
          id="companyFilter"
          value={value}
          onChange={onChange}
          className="block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors duration-200 ease-in-out dark:border-gray-600 dark:text-white appearance-none"
        >
          {companies.map((company: string) => (
            <option
              key={company}
              value={company}
              className="py-2 px-3 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {company === "all" ? "All Companies" : company}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 rotate-90">
          {">"}
        </div>
      </div>
    </div>
  );
};

export default function UsersPage() {
  const dispatch = useAppDispatch();
  const users = useAppSelector(selectAllUsers);
  const status = useAppSelector(selectUsersStatus);
  const [page, setPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [companyFilter, setCompanyFilter] = useState("all");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);

  // Get unique companies from users
  const companies =
    users.length > 0
      ? [
          "all",
          ...new Set(users.map((user) => user.company?.name || "Unknown")),
        ]
      : ["all"];

  // Filter users by company
  const filteredUsers =
    companyFilter === "all"
      ? users
      : users.filter((user) => user.company?.name === companyFilter);

  // Get current page users
  const indexOfFirstUser = (page - 1) * usersPerPage;
  const indexOfLastUser = indexOfFirstUser + usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Reset to first page when filter changes
  useEffect(() => {
    setPage(1);
  }, [companyFilter]);

  // Handler for company filter change
  const handleCompanyChange = (e) => {
    setCompanyFilter(e.target.value);
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Users | Admin Panel</title>
      </Head>

      {/* Header and filters section */}
      <div className="mb-6 space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Users
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize users
          </p>
        </div>

        {/* Company Filter */}
        <CompanyFilter
          companies={companies}
          value={companyFilter}
          onChange={handleCompanyChange}
        />
      </div>

      {/* Content section */}
      {status === "loading" ? (
        <div className="flex justify-center p-12">
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
                startIndex={indexOfFirstUser}
              />
            </div>
          </Suspense>

          {filteredUsers.length > 0 && (
            <Suspense fallback={<PaginationSkeleton />}>
              <div className="mt-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            </Suspense>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
