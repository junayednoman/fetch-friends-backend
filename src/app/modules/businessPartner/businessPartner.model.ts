import mongoose, { Schema } from "mongoose";
import { IBusinessPartner } from "./businessPartner.interface";

const BusinessPartnerSchema = new Schema<IBusinessPartner>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    code: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const BusinessPartner = mongoose.model<IBusinessPartner>("BusinessPartner", BusinessPartnerSchema);