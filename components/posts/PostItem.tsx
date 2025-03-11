"use client";
import { Post } from "@/state/store/feature/postSlice";
import { User } from "@/state/store/feature/userSlice";

interface PostItemProps {
  post: Post;
  author?: User;
}

export default function PostItem({ post, author }: PostItemProps) {
  return (
    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-1">
          {post.title}
        </h3>
        <div className="flex space-x-2">
          <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 text-sm font-medium">
            Edit
          </button>
          <button className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm font-medium">
            Delete
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {post.body}
      </p>

      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          {author ? (
            <>
              <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-medium mr-2">
                {author.name.charAt(0)}
              </div>
              <span>{author.name}</span>
            </>
          ) : (
            <span>Unknown Author</span>
          )}
        </div>
        <span className="mx-2">•</span>
        <span>Post ID: {post.id}</span>
      </div>
    </div>
  );
}
