import { z } from "zod";

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const postSchema = z.object({
  id: z.string().optional(),
  caption: z.string().trim().max(500).optional(),
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
  id: z.string().optional(),
  content: z.string().trim().min(4, "Comment is too short!"),
});

export type PostData = z.infer<typeof postSchema>;

export type CommentData = z.infer<typeof commentSchema>;
