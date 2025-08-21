import { z } from 'zod';

const createReelValidationSchema = z.object({
  caption: z.string().nullable().optional(),
});

export { createReelValidationSchema };
