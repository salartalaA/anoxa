"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIcon, Loader2, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type LoginData, loginSchema } from "@/schemas/auth.schema";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // setError,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    const result = await loginUser(data);

    if (
      result?.field === "user-validation" ||
      result?.field === "password-validation"
    ) {
      return toast.error(result.message, {
        position: "top-right",
        className: "bg-card! text-destructive! border-destructive/60!",
        closeButton: true,
      });
    }

    toast.success("Welcome back!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* COVER */}

      <div className="hidden flex-col justify-between bg-primary/5 p-12 lg:flex lg:w-1/2">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-blue-400 p-1 transition-transform duration-300 hover:scale-110">
              <ActivityIcon className="text-violet-800" />
            </span>
            <span className="font-semibold text-lg tracking-tight">
              <span className="text-white">AN</span>
              <span className="text-primary">OXA</span>
            </span>
          </div>
        </div>

        <div>
          <h1 className="mb-4 font-bold text-4xl">
            <span className="bg-linear-to-r from-primary to-primary/6 bg-clip-text text-transparent">
              Powerful Platform
            </span>
            <br />
            <span className="text-foreground">Intuitive Management</span>
          </h1>

          <p className="max-w-md text-lg text-muted-foreground">
            A modern social media platform with advanced admin dashboard,
            role-based access control, and comprehensive moderation tools.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-linear-to-br from-primary/20 to-primary/40 font-medium text-xs">
              JD
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-linear-to-br from-primary/20 to-primary/40 font-medium text-xs">
              SK
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-linear-to-br from-primary/20 to-primary/40 font-medium text-xs">
              AM
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-linear-to-br from-primary/20 to-primary/40 font-medium text-xs">
              TL
            </div>
          </div>

          <p className="text-muted-foreground text-sm">
            <span className="font-semibold text-foreground">500+</span> active
            users
          </p>
        </div>
      </div>

      {/* FORM */}

      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md animate-fade-up space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="font-bold text-3xl tracking-tight">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {/* <Button className="w-full" variant={"destructive"}>
            <AlertTriangle />
            <div className="text-sm">
              Invalid email or password. Please try again.
            </div>
          </Button> */}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-address">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 pl-10"
                    id="email-address"
                    placeholder="name@example.com"
                    type="email"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-destructive text-sm">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    className="text-primary text-sm hover:underline"
                    href="/auth/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative mt-1.5">
                  <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 pl-10"
                    id="password"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password")}
                  />
                </div>
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
                  <Loader2 className="animate-spin" /> Signing in ...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                New to the platform?
              </span>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Don't have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/auth/register"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
