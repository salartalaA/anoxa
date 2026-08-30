import { z } from "zod";

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .max(16, "Too long!"),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Username must be at least 5 characters.")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain lowercase letters, numbers, and underscores."
    )
    .max(16, "Too long!"),
  email: z
    .email("Please enter a valid email address.")
    .trim()
    .toLowerCase()
    .max(24, "Too long!"),
  // password: z.string().trim().min(8, "Password must be at least 8 characters."),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters.")
    .max(250, "Too long!")
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

export const editProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .max(16, "Too long!"),
  bio: z.string().trim().max(240, "Too long!").optional(),
  avatarURL: z
    .url("Please enter a valid avatar url!")
    .trim()
    .min(15, "Avatar url must be at least 15 characters.")
    .or(z.literal(""))
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Please enter a valid email address.").trim().toLowerCase(),
});

export const resetPasswordSchema = z.object({
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

export type LoginData = z.infer<typeof loginSchema>;

export type RegisterData = z.infer<typeof registerSchema>;

export type EditProfileData = z.infer<typeof editProfileSchema>;

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
