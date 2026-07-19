import crypto from "node:crypto";
import { redirect } from "next/navigation";
import { getCurrentUser, resetToken } from "@/actions/auth";
import ResetPasswordPage from "./_reset-password";

export default async function ResetPassword({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const user = await getCurrentUser();

  if (user) {
    return redirect("/");
  }

  const { token } = await params;

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  await resetToken(tokenHash);

  return <ResetPasswordPage tokenHash={tokenHash} />;
}
