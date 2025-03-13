"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import ThemeToggle from "./themeToggle";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Header({ isOpen, setIsOpen }: HeaderProps) {
  const { data: session } = useSession();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-30 fixed w-full">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Hamburger menu for mobile */}
            <button
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 mr-4 sm:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center">
            <ThemeToggle />

            <div className="ml-4 relative flex-shrink-0">
              <div>
                <button
                  type="button"
                  className="flex text-sm rounded-full border border-gray-300 dark:border-gray-600 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  id="user-menu"
                  aria-expanded={showProfileMenu}
                  aria-haspopup="true"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
                    {session?.user?.name?.charAt(0) || "A"}
                  </div>
                </button>
              </div>

              {showProfileMenu && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                    role="menuitem"
                  >
                    {session?.user?.name || "Admin User"}
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                    role="menuitem"
                  >
                    {session?.user?.email || "admin@example.com"}
                  </div>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem"
                    onClick={() =>
                      signOut({ callbackUrl: "/pages/auth/signin" })
                    }
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
