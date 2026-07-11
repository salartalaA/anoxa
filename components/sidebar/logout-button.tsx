"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await logout();

    toast.success("Signed out successfully.", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });

    router.push("/auth/login");
  }

  return (
    <Button className="w-full" onClick={handleLogout} variant="outline">
      <LogOut size={16} />
      Sign out
    </Button>
  );
}
