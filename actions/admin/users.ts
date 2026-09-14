"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { requireActiveUser } from "../auth";

export async function changeUserRole(userId: string) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const hasPerm = currentUser.role === "OWNER";

  if (!hasPerm) {
    return null;
  }

  const existingTarget = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingTarget) {
    return null;
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isVerified: !existingTarget.isVerified,
    },
  });

  if (!updatedUser) {
    return null;
  }

  revalidatePath("/admin/users");
}
