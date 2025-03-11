"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Pagination from "@/components/ui/Pagination";
import { useAppDispatch, useAppSelector } from "@/state/store/hook";
import {
  fetchPosts,
  selectAllPosts,
  selectPostsStatus,
} from "@/state/store/feature/postSlice";
import { fetchUsers, selectAllUsers } from "@/state/store/feature/userSlice";
import PostList from "@/components/posts/PostList";

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

        <div className="mt-4 md:mt-0">
          <button
            type="button"
            className="px-4 py-2 bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-gray-900 dark:text-white"
          >
            Add New Post
          </button>
        </div>
      </div>

      {postsStatus === "loading" ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : postsStatus === "failed" ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error loading posts. Please try again.
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <PostList posts={currentPosts} users={users} />
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
