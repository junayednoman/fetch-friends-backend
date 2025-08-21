import mongoose from "mongoose";
import { TReels } from "./reels.interface";

const ReelsSchema = new mongoose.Schema<TReels>({
  video: { type: String, required: true },
  caption: { type: String, required: false, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  reactions: { type: [mongoose.Schema.Types.ObjectId], ref: "Auth", default: [] },
}, {
  timestamps: true
});

const Reel = mongoose.model('Reels', ReelsSchema);
export default Reel;