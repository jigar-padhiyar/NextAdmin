import React from "react";
import Dashboard from "./pages/dashboard/dashboard";
import SignIn from "./pages/auth/signin/signIn";

const Page = () => {
  return false ? <Dashboard /> : <SignIn />;
};

export default Page;
