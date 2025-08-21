import mongoose, { Schema } from "mongoose";
import { TPost } from "./post.interface";

const postSchema = new Schema<TPost>(
  {
    location: { type: String, trim: true, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String], default: null },
    caption: { type: String, trim: true, default: null },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    notInterests: { type: [mongoose.Schema.Types.ObjectId], ref: "Auth" },
    reactions: { type: [mongoose.Schema.Types.ObjectId], ref: "Auth" },
    shares: { type: [mongoose.Schema.Types.ObjectId], ref: "Auth" },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model<TPost>("Post", postSchema);
export default Post;
