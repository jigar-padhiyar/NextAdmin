"use client";

import React, { useEffect } from "react";
import Dashboard from "./pages/dashboard/dashboard";
import SignIn from "./pages/auth/signin/signIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/pages/auth/signin");
    }
  }, [status, router]);
  return status === "unauthenticated" ? <SignIn /> : <Dashboard />;
};

export default Page;
