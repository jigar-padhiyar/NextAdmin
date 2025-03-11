import { Post } from "@/state/store/feature/postSlice";
import { User } from "@/state/store/feature/userSlice";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
  users: User[];
}

export default function PostList({ posts, users }: PostListProps) {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.length === 0 ? (
        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
          No posts found.
        </div>
      ) : (
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            author={users.find((user) => user.id === post.userId)}
          />
        ))
      )}
    </div>
  );
}
