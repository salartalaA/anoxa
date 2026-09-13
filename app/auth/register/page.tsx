import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import RegisterPage from "./_register";

export const metadata: Metadata = {
  title: "Register",
};

export default async function Register() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <RegisterPage />;
}
