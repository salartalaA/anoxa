import { redirect } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import LoginPage from "./_login";

export default async function Login() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return <LoginPage />;
}
