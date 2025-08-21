import mongoose, { Schema, Types } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>(
  {
    author: { type: Types.ObjectId, ref: "Auth", required: true },
    post: { type: Types.ObjectId, ref: "Post", required: true },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model<TComment>("Comment", commentSchema);
export default Comment;