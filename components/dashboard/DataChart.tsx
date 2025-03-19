import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
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

  // Prepare data for the combined pie chart
  // Normalize data for the pie chart
  const getCombinedPieData = () => {
    return metricsData.map((metric) => {
      // For API Response, use percentage of limit, inverted (lower is better)
      const normalizedValue =
        metric.name === "API Response"
          ? (1 - metric.value / metric.limit) * 100
          : (metric.value / metric.limit) * 100;

      return {
        name: metric.name,
        value: normalizedValue,
        color: metric.color,
        rawValue: metric.value,
        unit: metric.unit,
        change: metric.change,
        changeType: metric.changeType,
        limit: metric.limit,
      };
    });
  };

  // Active sector state for pie chart hover
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);

  // Custom active shape for pie chart sectors
  const renderActiveShape = (props: any) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
      </g>
    );
  };

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

      {/* Combined Pie Chart */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
          Metrics Performance
        </h3>
        <div className="flex flex-col ">
          <div className="w-full">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getCombinedPieData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={2}
                    dataKey="value"
                    activeIndex={activeIndex}
                    activeShape={renderActiveShape}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(undefined)}
                  >
                    {getCombinedPieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => {
                      const metric = metricsData.find((m) => m.name === name);
                      if (!metric) return [value, name];

                      const displayValue =
                        metric.name === "API Response"
                          ? `${metric.value.toFixed(2)}${metric.unit} (${(
                              100 - Number(value)
                            ).toFixed(1)}% of limit)`
                          : `${metric.value}${metric.unit} (${Number(
                              value
                            ).toFixed(1)}% of limit)`;

                      return [displayValue, name];
                    }}
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "0.375rem",
                      color: "#F3F4F6",
                    }}
                  />
                  <Legend
                    formatter={(value) => {
                      const metric = metricsData.find((m) => m.name === value);
                      return metric
                        ? `${value} ${metric.change} ${
                            metric.changeType === "increase" ? "↑" : "↓"
                          }`
                        : value;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full p-6">
            <h4 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-4">
              Performance Summary
            </h4>
            <ul className="space-y-3">
              {metricsData.map((metric, index) => (
                <li key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: metric.color }}
                  ></div>
                  <div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {metric.name}:
                    </span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {metric.name === "API Response"
                        ? `${Math.round(
                            (1 - metric.value / metric.limit) * 100
                          )}% efficiency`
                        : `${Math.round(
                            (metric.value / metric.limit) * 100
                          )}% utilization`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Note:
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This chart displays normalized metrics performance. For API
                Response, higher values are better (faster response times). For
                Users and Posts, higher values indicate higher resource
                utilization.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional context */}
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>
          * Pie chart compares the performance of all metrics in a normalized
          form
        </p>
        <p>
          * API Response target: under 2s (inverted for comparison - higher pie
          segment means better performance)
        </p>
        <p>* Users capacity: 100, Posts capacity: 300</p>
        <p>* ↑ indicates improvement, ↓ indicates decline</p>
      </div>
    </div>
  );
};

export default DashboardCharts;
