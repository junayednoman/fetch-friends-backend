import { z } from "zod";

export const categoryCreateValidationSchema = z.object({
  name: z.string().trim(),
});

export const updateCategoryValidationSchema = z.object({
  name: z.string().trim().optional()
});
