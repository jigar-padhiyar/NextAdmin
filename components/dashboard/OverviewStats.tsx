"use client";

interface OverviewStatsProps {
  usersCount: number;
  postsCount: number;
}

export default function OverviewStats({
  usersCount,
  postsCount,
}: OverviewStatsProps) {
  const stats = [
    {
      name: "Total Users",
      value: usersCount,
      icon: "👥",
      change: "+5%",
      changeType: "increase",
    },
    {
      name: "Total Posts",
      value: postsCount,
      icon: "📝",
      change: "+12%",
      changeType: "increase",
    },
    {
      name: "Active Sessions",
      value: 24,
      icon: "🔄",
      change: "-3%",
      changeType: "decrease",
    },
    {
      name: "Response Time",
      value: "1.2s",
      icon: "⚡",
      change: "-15%",
      changeType: "increase",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {stat.value}
              </p>
            </div>
            <div className="text-2xl">{stat.icon}</div>
          </div>
          <div
            className={`mt-3 text-xs font-medium ${
              stat.changeType === "increase"
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }`}
          >
            {stat.change} {stat.changeType === "increase" ? "↑" : "↓"}
          </div>
        </div>
      ))}
    </div>
  );
}
