"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  isOpen,
  setIsOpen,
  collapsed,
  setCollapsed,
}: SideBarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Handle resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const navigation = [
    { name: "Dashboard", href: "/pages/dashboard", icon: "📊" },
    { name: "Users", href: "/pages/dashboard/users", icon: "👥" },
    { name: "Posts", href: "/pages/posts", icon: "📝" },
  ];

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 
          ${
            isOpen && window.innerWidth <= 640
              ? "translate-x-0"
              : "-translate-x-full sm:translate-x-0"
          } 
           fixed h-[100dvh] z-20 ${collapsed ? "w-16" : "w-64"}`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          {!collapsed && (
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Admin Panel
            </span>
          )}
          {window.innerWidth >= 640 ? (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {collapsed ? "→" : "←"}
            </button>
          ) : (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 sm:hidden"
            >
              ✕
            </button>
          )}
        </div>

        <div className="p-4">
          {!collapsed && (
            <div className="mb-6 flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                {session?.user?.name?.charAt(0) || "A"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {session?.user?.name || "Admin User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {session?.user?.role || "Admin"}
                </p>
              </div>
            </div>
          )}

          <nav className="space-y-1">
            {navigation.map((item) => {
              const getLastSegment = (path: string) =>
                path.split("/").filter(Boolean).pop();
              const isActive =
                getLastSegment(pathname) === getLastSegment(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-2 py-2 rounded-md ${
                    isActive
                      ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                  } ${collapsed ? "justify-center" : ""}`}
                  onClick={() => window.innerWidth < 640 && setIsOpen(false)}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
