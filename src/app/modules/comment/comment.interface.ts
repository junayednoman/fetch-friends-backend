import { ObjectId } from "mongoose";

export interface TComment {
  author: ObjectId;
  post: ObjectId;
  text: string;
}