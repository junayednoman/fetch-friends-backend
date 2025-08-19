import { z } from "zod";

// Define Zod schema for BusinessPartner
export const businessPartnerZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().min(1, "Phone number is required"),
});

// Export for type inference
export type TBusinessPartnerSignup = z.infer<typeof businessPartnerZodSchema> & {
  code: string;
};