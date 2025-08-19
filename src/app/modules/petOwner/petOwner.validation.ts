import { z } from "zod";

// Define Zod schema for Pet
export const petOwnerValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  referralCode: z.string().optional(),
});

export const petOwnerUpdateValidationSchema = z.object({
  name: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  age: z.number().optional(),
  category: z.string().optional(),
  vaccinated: z.boolean().optional(),
  about: z.string().optional(),
  petOwnerName: z.string().optional(),
  aboutPetOwner: z.string().optional(),
  petOwnerGender: z.enum(["male", "female", "other"]).optional(),
  petOwnerAge: z.number().optional()
});

export type TPetOwnerUpdate = z.infer<typeof petOwnerUpdateValidationSchema> & { image?: string, coverImage?: string, petOwnerImage?: string };

export type TPetOwnerSignUp = z.infer<typeof petOwnerValidationSchema>;
