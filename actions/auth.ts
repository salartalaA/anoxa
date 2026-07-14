"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import type { LoginData, RegisterData } from "@/schemas/auth.schema";

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
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return;
  }

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
