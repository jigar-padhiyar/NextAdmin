"use client";

import React from "react";
import Dashboard from "./pages/dashboard/dashboard";
import SignIn from "./pages/auth/signin/signIn";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  return status === "unauthenticated" ? <SignIn /> : <Dashboard />;
};

export default Page;
