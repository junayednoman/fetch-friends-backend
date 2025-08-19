import mongoose, { Schema, Types } from "mongoose";
import { IPetOwner } from "./petOwner.interface";

const PetOwnerSchema = new Schema<IPetOwner>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    coverImage: { type: String },
    gender: { type: String, enum: ["male", "female", "other"], },
    age: { type: Number, },
    category: { type: Types.ObjectId, ref: "Category", },
    vaccinated: { type: Boolean, },
    about: { type: String },
    petOwnerImage: { type: String },
    petOwnerName: { type: String, },
    aboutPetOwner: { type: String },
    petOwnerGender: { type: String, enum: ["male", "female", "other"], },
    petOwnerAge: { type: Number, },
    petGallery: [{ type: String }],
    ownerGallery: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const PetOwner = mongoose.model<IPetOwner>("PetOwner", PetOwnerSchema);