import { ObjectId } from "mongoose";

export type ReportStatusEnum = "pending" | "resolved" | "removedPost" | "blockedUser"

export interface TReport {
  reporter: ObjectId;
  post: ObjectId;
  reason: string;
  status: ReportStatusEnum;
}