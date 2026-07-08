import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(5, "Full name must be at least 5 characters."),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Username must be at least 5 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores."
    ),
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
  // password: z.string().trim().min(8, "Password must be at least 8 characters."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/\d/, "Password must contain at least one number.")
    .regex(
      /[!@#$%^&*(),.?":{}|<>_\-+=/\\[\]`~';]/,
      "Password must contain at least one special character."
    ),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
  password: z.string().trim().min(8, "Password must be at least 8 characters."),
});

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;
