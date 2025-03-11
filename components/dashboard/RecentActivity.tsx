import { useMemo } from "react";
import Link from "next/link";
import { Post } from "@/state/store/feature/postSlice";
import { User } from "next-auth";

interface RecentActivityProps {
  posts: Post[];
  users: User[];
}

export default function RecentActivity({ posts, users }: RecentActivityProps) {
  // Create combined activity feed
  const activities = useMemo(() => {
    const postActivities = posts.map((post) => ({
      id: `post-${post.id}`,
      type: "post",
      title: post.title,
      user:
        users.find((user) => user.id === post.userId.toString())?.name ||
        "Unknown user",
      time: "2 hours ago", // Mock data since JSONPlaceholder doesn't provide timestamps
    }));

    const userActivities = users.map((user) => ({
      id: `user-${user.id}`,
      type: "user",
      title: `New user: ${user.name}`,
      user: user.name,
      time: "3 hours ago", // Mock data
    }));

    // Combine and sort (mock sorting since we don't have real timestamps)
    return [...postActivities, ...userActivities]
      .sort(() => 0.5 - Math.random()) // Random sort for demo
      .slice(0, 10);
  }, [posts, users]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h2>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map((activity) => (
          <div key={activity.id} className="py-3 flex items-start">
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                activity.type === "post"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {activity.type === "post" ? "📝" : "👤"}
            </div>

            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By {activity.user} • {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="#"
          className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          View all activity →
        </Link>
      </div>
    </div>
  );
}
