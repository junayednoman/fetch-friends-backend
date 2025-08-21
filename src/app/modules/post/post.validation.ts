import { z } from "zod";

export const createPostValidationSchema = z.object({
  location: z.string().trim().min(1, "Location is required"),
  category: z.string().min(1, "Category ID is required"),
  caption: z.string().trim().optional().nullable()
});

export type TCreatePost = z.infer<typeof createPostValidationSchema> & { author: string, images: string[] };

export const updatePostValidationSchema = z.object({
  location: z.string().trim().optional(),
  category: z.string().optional(),
  caption: z.string().trim().optional().nullable()
});
