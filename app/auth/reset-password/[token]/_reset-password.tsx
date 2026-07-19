"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { resetPassword } from "@/actions/auth";
import { Rule } from "@/components/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  type ResetPasswordData,
  resetPasswordSchema,
} from "@/schemas/auth.schema";

export default function RegisterPage({ tokenHash }: { tokenHash: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    // setError,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: ResetPasswordData) => {
    await resetPassword(data, tokenHash);

    toast.success("Password updated successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });

    router.push("/auth/login");
  };

  const password = watch("password") ?? "";

  const rules = {
    length: password.length >= 8,
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    lowercase: /[a-z]/.test(password),
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    uppercase: /[A-Z]/.test(password),
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    number: /\d/.test(password),
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    special: /[^A-Za-z0-9]/.test(password),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-background via-background to-muted/20">
      {/* FORM */}

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-up space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-3xl tracking-tight">
              Reset Password
            </h2>
            <p className="mt-2 text-muted-foreground">
              Update your password with a strong one.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Password</Label>

                <div className="relative mt-1.5">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    className="h-10 pl-10"
                    id="password"
                    placeholder="Create a strong password"
                    type="password"
                    {...register("password")}
                  />
                </div>

                {password.length > 0 ? (
                  <div className="fade-in slide-in-from-top-2 mt-3 animate-in space-y-2 rounded-lg border bg-muted/30 p-3 duration-200">
                    <Rule valid={rules.length}>At least 8 characters</Rule>

                    <Rule valid={rules.lowercase}>One lowercase letter</Rule>

                    <Rule valid={rules.uppercase}>One uppercase letter</Rule>

                    <Rule valid={rules.number}>One number</Rule>

                    <Rule valid={rules.special}>One special character</Rule>
                  </div>
                ) : (
                  <p className="mt-1 text-muted-foreground text-xs">
                    Use 8+ characters with uppercase, lowercase, number, and
                    symbol
                  </p>
                )}

                {errors.password && (
                  <p className="mt-1 text-destructive text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <Button
              className={cn("h-10 w-full py-2", isSubmitting && "bg-primary")}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" /> Updating Password ...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
