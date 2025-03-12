import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface MetricData {
  name: string;
  value: number;
  unit: string;
  limit: number;
  color: string;
  change: string;
  changeType: "increase" | "decrease";
}

interface DashboardChartsProps {
  useRandomData?: boolean;
  apiData?: {
    users: any[];
    posts: any[];
  };
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  useRandomData = false,
  apiData,
}) => {
  // Initial sample data with change indicators
  const [metricsData, setMetricsData] = useState<MetricData[]>([
    {
      name: "API Response",
      value: 1.2,
      unit: "s",
      limit: 2.0,
      color: "#F59E0B",
      change: "-15%",
      changeType: "increase", // For API response, decrease is good (faster)
    },
    {
      name: "Total Users",
      value: 85,
      unit: "",
      limit: 100,
      color: "#3B82F6",
      change: "+5%",
      changeType: "increase",
    },
    {
      name: "Total Posts",
      value: 237,
      unit: "",
      limit: 300,
      color: "#10B981",
      change: "+12%",
      changeType: "increase",
    },
  ]);

  // Effect to set data from API when useRandomData is false
  useEffect(() => {
    if (!useRandomData && apiData) {
      const usersCount = apiData.users.length;
      const postsCount = apiData.posts.length;

      // Mock API response time - in a real app, you might calculate this from actual API requests
      const mockApiResponseTime = 0.8 + Math.random() * 0.5;

      setMetricsData([
        {
          name: "API Response",
          value: mockApiResponseTime,
          unit: "s",
          limit: 2.0,
          color: "#F59E0B",
          change: "-10%", // This would be calculated based on previous values in a real app
          changeType: "increase",
        },
        {
          name: "Total Users",
          value: usersCount,
          unit: "",
          limit: 100,
          color: "#3B82F6",
          change: `+${Math.round((usersCount / 100) * 100)}%`,
          changeType: "increase",
        },
        {
          name: "Total Posts",
          value: postsCount,
          unit: "",
          limit: 300,
          color: "#10B981",
          change: `+${Math.round((postsCount / 300) * 100)}%`,
          changeType: "increase",
        },
      ]);
    }
  }, [useRandomData, apiData]);

  // Simulate data updates for random data
  useEffect(() => {
    if (!useRandomData) return;

    const interval = setInterval(() => {
      setMetricsData((prev) =>
        prev.map((metric) => {
          let newValue = metric.value;
          let newChange = metric.change;

          // Randomly adjust values for demonstration
          if (metric.name === "API Response") {
            // Response time fluctuates between 0.8s and 1.6s
            const changeAmount = Math.random() * 0.2 - 0.1;
            newValue = Math.max(0.8, Math.min(1.6, newValue + changeAmount));
            // For API response, negative change is good (faster response)
            newChange = `${
              (changeAmount < 0 ? "" : "+") + (changeAmount * 100).toFixed(1)
            }%`;
          } else if (metric.name === "Total Users") {
            // User count slowly increases
            const increase = Math.floor(Math.random() * 2);
            newValue = Math.min(metric.limit, newValue + increase);
            newChange = `+${((increase / newValue) * 100).toFixed(1)}%`;
          } else if (metric.name === "Total Posts") {
            // Post count increases faster than users
            const increase = Math.floor(Math.random() * 4);
            newValue = Math.min(metric.limit, newValue + increase);
            newChange = `+${((increase / newValue) * 100).toFixed(1)}%`;
          }

          return {
            ...metric,
            value: newValue,
            change: newChange,
            // For API response, negative change is good
            changeType:
              metric.name === "API Response"
                ? newChange.startsWith("+")
                  ? "decrease"
                  : "increase"
                : newChange.startsWith("+")
                ? "increase"
                : "decrease",
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [useRandomData]);

  // Calculate percentage of limit for each metric
  const normalizedData = metricsData.map((metric) => ({
    ...metric,
    percentage: (metric.value / metric.limit) * 100,
  }));

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Dashboard Metrics
        </h2>
        {apiData && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {useRandomData ? "Using simulated data" : "Using API data"}
          </div>
        )}
      </div>

      {/* Metrics Cards with Change Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {metricsData.map((metric, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-5 rounded-lg shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400 truncate mr-2">
                {metric.name}
              </h3>
              <span
                className={`text-xs whitespace-nowrap font-medium px-2 py-1 rounded-full ${
                  metric.changeType === "increase"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {metric.change} {metric.changeType === "increase" ? "↑" : "↓"}
              </span>
            </div>
            <p
              className="mt-2 text-xl sm:text-2xl font-semibold"
              style={{ color: metric.color }}
            >
              {metric.name === "API Response"
                ? metric.value.toFixed(2) + metric.unit
                : metric.value + metric.unit}
            </p>
            <div className="mt-2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded">
              <div
                className="h-full rounded transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    (metric.value / metric.limit) * 100
                  )}%`,
                  backgroundColor: metric.color,
                }}
              ></div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {Math.round((metric.value / metric.limit) * 100)}% of limit
            </p>
          </div>
        ))}
      </div>

      {/* Combined Bar Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Combined Metrics
        </h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={normalizedData}
              margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="name" tick={{ fill: "#6B7280" }} />
              <YAxis
                tick={{ fill: "#6B7280" }}
                label={{
                  value: "Percentage of Limit (%)",
                  angle: -90,
                  position: "insideBottomLeft",
                  fill: "#6B7280",
                }}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  const metric = metricsData.find(
                    (m) => m.name === props.payload.name
                  );
                  return [
                    metric
                      ? `${metric.value}${metric.unit} (${Number(value).toFixed(
                          0
                        )}%)`
                      : "",
                    `${props.payload.name} ${metric ? metric.change : ""} ${
                      metric && metric.changeType === "increase" ? "↑" : "↓"
                    }`,
                  ];
                }}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "none",
                  borderRadius: "0.375rem",
                  color: "#F3F4F6",
                }}
              />
              <Legend />
              <ReferenceLine y={100} stroke="#EF4444" strokeDasharray="3 3" />
              <Bar
                dataKey="percentage"
                name="Current Value"
                radius={[4, 4, 0, 0]}
              >
                {normalizedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional context */}
      <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        <p>
          * Bar chart shows each metric as a percentage of its defined limit
        </p>
        <p>
          * API Response target: under 2s, Users capacity: 100, Posts capacity:
          300
        </p>
        <p>
          * ↑ indicates improvement, ↓ indicates decline (for API Response,
          lower is better)
        </p>
      </div>
    </div>
  );
};

export default DashboardCharts;
