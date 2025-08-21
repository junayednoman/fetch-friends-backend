import { z } from "zod";
import { Types } from "mongoose";

// Define Zod schema for Comment
export const commentZodSchema = z.object({
  post: z.string().refine((id) => Types.ObjectId.isValid(id), "Invalid author ID"),
  text: z.string().min(1, "Text is required"),
});