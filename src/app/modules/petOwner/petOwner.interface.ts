import { ObjectId } from "mongoose";

type Gender = "male" | "female" | "other";

// Define the Pet interface
export interface IPetOwner {
  name: string;
  email: string;
  image?: string;
  coverImage?: string;
  gender: Gender;
  age: number;
  category: ObjectId;
  vaccinated: boolean;
  about?: string;
  petOwnerImage?: string;
  petOwnerName: string;
  aboutPetOwner?: string;
  petOwnerGender: Gender;
  petOwnerAge: number;
  petGallery: string[];
  ownerGallery: string[];
}