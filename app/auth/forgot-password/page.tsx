import { ActivityIcon, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
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
              Forgot password?
            </h2>
            <p className="mt-2 text-muted-foreground">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email-address">Email address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="h-10 pl-10"
                    id="email-address"
                    placeholder="name@example.com"
                    required
                    type="email"
                  />
                </div>
              </div>
            </div>
            <Button className="h-10 w-full py-2" type="submit">
              Send reset link
            </Button>
          </form>

          <div className="relative -mt-8 w-full">
            <div className="relative flex justify-center text-xs uppercase">
              <Link className="w-full bg-background" href="/auth/login">
                <Button className="w-full" variant={"ghost"}>
                  <ArrowLeft />
                  Back to sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* GMAIL SEND */}

        {/* <div className="w-full max-w-md animate-fade-up space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CircleCheck className="h-8 w-8 text-success" />
            </div>

            <h2 className="font-bold text-2xl">Check your email</h2>

            <p className="mt-2 max-w-sm text-muted-foreground">
              We've sent password reset instructions to{" "}
              <span className="font-medium text-foreground">
                salarmhmdn@gmail.com
              </span>
            </p>
          </div>

          <Link href="/auth/login">
            <Button className="w-full gap-2" variant="outline">
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Button>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
