"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import ResetPasswordEmail from "@/emails/reset-password";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";
import type {
  ForgotPasswordData,
  LoginData,
  RegisterData,
  ResetPasswordData,
} from "@/schemas/auth.schema";

export async function registerUser(data: RegisterData) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    if (existingUser.email === data.email) {
      return {
        success: false,
        field: "email",
        message: "This email already exists!",
      };
    }

    return {
      success: false,
      field: "username",
      message: "This username already exists!",
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  await prisma.user.create({
    data: {
      fullName: data.fullName,
      username: data.username,
      email: data.email,
      password: hashedPassword,
    },
  });
}

export async function loginUser(data: LoginData) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return {
      success: false,
      field: "user-validation",
      message: "Invalid credentials.",
    };
  }

  const isPasswordCorrect = await bcrypt.compare(data.password, user.password);

  if (!isPasswordCorrect) {
    return {
      success: false,
      field: "password-validation",
      message: "Invalid credentials.",
    };
  }

  if (user.status === "BANNED") {
    return {
      success: false,
      field: "banned-user",
      message: "Your account has been banned!",
    };
  }

  const sessionId = crypto.randomUUID();

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      expiresAt: expires,
    },
  });

  const cookieStore = await cookies();

  cookieStore.set("session", sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires,
    path: "/",
  });

  return {
    success: true,
  };
}

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.user.status === "BANNED") {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });

    return redirect("/auth/login");
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.deleteMany({
      where: {
        id: session.id,
      },
    });

    return;
  }

  return session.user;
}

export async function requireActiveUser() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return {
      success: false,
      reason: "UNAUTHORIZED",
    } as const;
  }

  if (currentUser.status === "SUSPENDED") {
    return {
      success: false,
      reason: "SUSPENDED",
      message: "Your account has been suspended!",
    } as const;
  }

  return {
    success: true,
    user: currentUser,
  } as const;
}

export async function logout() {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
      },
    });
  }

  cookieStore.delete("session");
}

export async function deleteAccount(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const hasPermission = currentUser.id === userId;

  if (!hasPermission) {
    return;
  }

  await prisma.user.delete({
    where: {
      id: currentUser.id,
    },
  });

  revalidatePath("/auth/register");
}

export async function requestPasswordReset(data: ForgotPasswordData) {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    return;
  }

  const token = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashedToken,
      expiresAt,
      userId: user.id,
    },
  });

  if (!process.env.EMAIL_FROM) {
    throw new Error("EMAIL_FROM is missing");
  }

  const resetLink =
    process.env.NODE_ENV === "development"
      ? `http://localhost:3000/auth/reset-password/${token}`
      : `https://anoxa.vercel.app/auth/reset-password/${token}`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "Reset your password",
    react: <ResetPasswordEmail resetUrl={resetLink} />,
  });
}

export async function resetToken(tokenHash: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!resetToken) {
    notFound();
  }

  if (resetToken.expiresAt < new Date()) {
    await prisma.passwordResetToken.delete({
      where: {
        tokenHash,
      },
    });

    notFound();
  }

  return resetToken;
}

export async function resetPassword(
  data: ResetPasswordData,
  tokenHash: string
) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const tokenData = await prisma.passwordResetToken.findUnique({
    where: {
      tokenHash,
    },
  });

  if (!tokenData) {
    return;
  }

  await prisma.user.update({
    data: {
      password: hashedPassword,
    },

    where: {
      id: tokenData.userId,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: tokenData.userId,
    },
  });
}
