import { z } from 'zod';
const storyValidationSchema = z.object({
  caption: z.string().nullable().optional(),
});
export default storyValidationSchema;