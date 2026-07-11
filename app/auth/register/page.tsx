import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import RegisterPage from "./_register";

export default async function Register() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <RegisterPage />;
}
