"use client";
import { useEffect, useState, lazy, Suspense } from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
} from "@/state/store/feature/postSlice";
import { fetchUsers, selectAllUsers } from "@/state/store/feature/userSlice";

// Lazy load components
const PostList = lazy(() => import("@/components/posts/PostList"));
const Pagination = lazy(() => import("@/components/ui/Pagination"));

// Loading fallbacks
const PostListSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
    <div className="p-4 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-4"
        >
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded mb-3"></div>
          <div className="h-20 w-full bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded ml-2"></div>
            </div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PaginationSkeleton = () => (
  <div className="mt-4 flex justify-center">
    <div className="h-10 w-64 bg-gray-200 dark:bg-gray-600 rounded"></div>
  </div>
);

export default function PostsPage() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const users = useAppSelector(selectAllUsers);
  const postsStatus = useAppSelector(selectPostsStatus);
  const [page, setPage] = useState(1);
  const [postsPerPage] = useState(10);

  useEffect(() => {
    if (postsStatus === "idle") {
      dispatch(fetchPosts());
      dispatch(fetchUsers());
    }
  }, [postsStatus, dispatch]);

  // Get current page posts
  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <DashboardLayout>
      <Head>
        <title>Posts | Admin Panel</title>
      </Head>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Posts
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage and organize content
          </p>
        </div>
      </div>

      {/* {postsStatus === "loading" ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : postsStatus === "failed" ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading posts. Please try again.
        </div>
      ) : ( */}
      <>
        <Suspense fallback={<PostListSkeleton />}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <PostList posts={currentPosts} users={users} />
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
      {/* )} */}
    </DashboardLayout>
  );
}
