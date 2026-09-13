import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import ForgotPasswordPage from "./_forgot-password";

export const metadata: Metadata = {
  title: "Forgot password",
};

export default async function ForgotPassword() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <ForgotPasswordPage />;
}
