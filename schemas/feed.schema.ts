import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const postSchema = z.object({
  caption: z.string().trim().optional(),
  image: z
    .file()
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only JPG and PNG images are allowed.",
    })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image must be less than 10MB.",
    }),
});

export const commentSchema = z.object({
  comment: z
    .string()
    .trim()
    .min(10, "Your comment should be at least 10 characters!"),
});

export type PostData = z.infer<typeof postSchema>;
export type CommentData = z.infer<typeof commentSchema>;
