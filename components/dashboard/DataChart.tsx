import { Post } from "@/state/store/feature/postSlice";
import { User } from "next-auth";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DataChartProps {
  users: User[];
  posts: Post[];
}

export default function DataChart({ users, posts }: DataChartProps) {
  // Prepare data for the chart
  const chartData = useMemo(() => {
    const userPostCounts = users.map((user) => {
      const userPosts = posts.filter(
        (post) => post.userId.toString() === user.id
      );
      return {
        name: (user.name ?? "").split(" ")[0], // Just use first name for display
        posts: userPosts.length,
        id: user.id,
      };
    });

    // Sort by post count and take top 8
    return userPostCounts.sort((a, b) => b.posts - a.posts).slice(0, 8);
  }, [users, posts]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        User Activity
      </h2>
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              opacity={0.1}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#9CA3AF" }}
            />
            <YAxis
              tick={{ fill: "#6B7280" }}
              axisLine={{ stroke: "#9CA3AF" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "none",
                borderRadius: "0.375rem",
                color: "#F3F4F6",
              }}
            />
            <Legend />
            <Bar
              dataKey="posts"
              name="Posts Count"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
