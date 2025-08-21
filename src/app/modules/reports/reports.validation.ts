import { z } from "zod";

export const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const reportStatusEnum = z.enum([
  "pending",
  "resolved",
  "removedPost",
  "blockedUser",
]);

export const reportSchema = z.object({
  post: objectId,
  reason: z.string().min(1, "Reason is required"),
});

export const updateReportSchema = z.object({
  status: reportStatusEnum,
})