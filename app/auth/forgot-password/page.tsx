import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import ForgotPasswordPage from "./_forgot-password";

export default async function ForgotPassword() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <ForgotPasswordPage />;
}
