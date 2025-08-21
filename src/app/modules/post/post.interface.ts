import { ObjectId } from "mongoose";

export type TPost = {
  location: string;
  category: ObjectId;
  images?: string[];
  caption?: string;
  author: ObjectId;
  notInterests?: ObjectId[];
  reactions?: ObjectId[];
  shares: ObjectId[];
  isDeleted?: boolean;
  isBlocked?: boolean;
};
