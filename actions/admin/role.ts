"use server";

import { requireActiveUser } from "@/actions/auth";
import type { Permission } from "@/app/generated/prisma/enums";
import prisma from "@/lib/prisma";

export async function hasPermission(permission: Permission) {
  const result = await requireActiveUser();

  if (!result.success) {
    return result;
  }

  const currentUser = result.user;

  const checkPermission = await prisma.rolePermission.findUnique({
    where: {
      role_permission: {
        role: currentUser.role,
        permission,
      },
    },
  });

  return !!checkPermission;
}
