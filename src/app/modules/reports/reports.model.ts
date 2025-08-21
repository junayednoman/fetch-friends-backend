import { model, Schema } from "mongoose";
import { TReport } from "./reports.interface";

const reportSchema = new Schema<TReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: "Auth", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "resolved", "removedPost", "blockedUser"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Report = model<TReport>("Report", reportSchema);