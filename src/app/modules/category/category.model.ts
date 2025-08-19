import mongoose, { Schema } from "mongoose";
import { TCategory } from "./category.interface";

const categorySchema = new Schema<TCategory>(
  {
    image: { type: String, required: true },
    name: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model<TCategory>("Category", categorySchema);
export default Category;
