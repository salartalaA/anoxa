import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "../app/generated/prisma/client";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const rolePermissionData: Prisma.RolePermissionCreateInput[] = [
  {
    role: "MODERATOR",
    permission: "VIEW_REPORT",
  },
  {
    role: "MODERATOR",
    permission: "REVIEW_REPORT",
  },
  {
    role: "MODERATOR",
    permission: "DELETE_OTHERS_COMMENT",
  },
  {
    role: "MODERATOR",
    permission: "DELETE_OTHERS_POST",
  },

  {
    role: "ADMIN",
    permission: "VIEW_REPORT",
  },
  {
    role: "ADMIN",
    permission: "REVIEW_REPORT",
  },
  {
    role: "ADMIN",
    permission: "SUSPEND_USER",
  },
  {
    role: "ADMIN",
    permission: "UNSUSPEND_USER",
  },
  {
    role: "ADMIN",
    permission: "BAN_USER",
  },
  {
    role: "ADMIN",
    permission: "UNBAN_USER",
  },
  {
    role: "ADMIN",
    permission: "MANAGE_ROLES",
  },
  {
    role: "ADMIN",
    permission: "DELETE_OTHERS_COMMENT",
  },
  {
    role: "ADMIN",
    permission: "DELETE_OTHERS_POST",
  },

  {
    role: "OWNER",
    permission: "VIEW_REPORT",
  },
  {
    role: "OWNER",
    permission: "REVIEW_REPORT",
  },
  {
    role: "OWNER",
    permission: "SUSPEND_USER",
  },
  {
    role: "OWNER",
    permission: "UNSUSPEND_USER",
  },
  {
    role: "OWNER",
    permission: "BAN_USER",
  },
  {
    role: "OWNER",
    permission: "UNBAN_USER",
  },
  {
    role: "OWNER",
    permission: "MANAGE_ROLES",
  },
  {
    role: "OWNER",
    permission: "DELETE_USER",
  },
  {
    role: "OWNER",
    permission: "DELETE_OTHERS_COMMENT",
  },
  {
    role: "OWNER",
    permission: "DELETE_OTHERS_POST",
  },
];

export async function main() {
  for (const rp of rolePermissionData) {
    await prisma.rolePermission.create({
      data: rp,
    });
  }
}

main();
