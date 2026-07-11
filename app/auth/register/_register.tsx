"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIcon, AtSign, Loader2, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth";
import { Rule } from "@/components/rules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { type RegisterData, registerSchema } from "@/schemas/auth.schema";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    // setError,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterData) => {
    const result = await registerUser(data);

    if (result?.field === "email" || result?.field === "username") {
      return toast.error(result.message, {
        position: "top-right",
        className: "bg-card! text-destructive! border-destructive/60!",
        closeButton: true,
      });
    }

    toast.success("Account created successfully!", {
      position: "top-right",
      className: "bg-card! text-primary!",
      closeButton: true,
    });

    router.push("/auth/login");
  };

  const password = watch("password") ?? "";
  const username = watch("username") ?? "";

  const usernameRules = {
    length: username.length >= 5,
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    lowercase: /^[a-z]/.test(username) || /^[a-z0-9_]+$/.test(username),
    // biome-ignore lint/performance/useTopLevelRegex: Regexes are only used in this component.
    validChars: /^[a-z0-9_]+$/.test(username),
  };

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
            <h2 className="font-bold text-3xl tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-muted-foreground">
              Get started with your free account today
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full-name">Full Name</Label>
                <div className="relative mt-1.5">
                  <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 pl-10"
                    id="full-name"
                    placeholder="John Doe"
                    type="text"
                    {...register("fullName")}
                  />
                </div>
                {errors.fullName && (
                  <p className="mt-1 text-destructive text-sm">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* <div>
                <Label htmlFor="username">Username</Label>
                <div className="relative mt-1.5">
                  <AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 pl-10"
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    {...register("username")}
                  />
                </div>
                <p className="mt-1 text-muted-foreground text-xs">
                  Only lowercase letters, numbers, and underscores
                </p>
                {errors.username && (
                  <p className="mt-1 text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div> */}

              <div>
                <Label htmlFor="username">Username</Label>

                <div className="relative mt-1.5">
                  <AtSign className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    className="h-10 pl-10"
                    id="username"
                    placeholder="johndoe"
                    type="text"
                    {...register("username")}
                  />
                </div>

                {username ? (
                  <div className="fade-in slide-in-from-top-2 mt-3 animate-in space-y-2 rounded-lg border bg-muted/30 p-3 duration-200">
                    <Rule valid={usernameRules.length}>
                      At least 5 characters
                    </Rule>

                    <Rule valid={usernameRules.validChars}>
                      Only lowercase letters, numbers, and underscores
                    </Rule>
                  </div>
                ) : (
                  <p className="mt-1 text-muted-foreground text-xs">
                    Only lowercase letters, numbers, and underscores
                  </p>
                )}

                {errors.username && (
                  <p className="mt-1 text-destructive text-sm">
                    {errors.username.message}
                  </p>
                )}
              </div>

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
                  <Loader2 className="animate-spin" /> Creating Account ...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Already have an account?
              </span>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link
              className="font-medium text-primary hover:underline"
              href="/auth/login"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
