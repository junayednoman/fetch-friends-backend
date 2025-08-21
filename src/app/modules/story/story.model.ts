import mongoose, { Schema } from "mongoose";
import TStory from "./story.interface";

const storySchema = new Schema<TStory>({
  image: { type: String, required: true },
  caption: { type: String, required: false, default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' }],
  stars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Auth' }],
  isDeleted: { type: Boolean, default: false },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: "1d" }
  }
}, {
  timestamps: true
})

const Story = mongoose.model<TStory>('Story', storySchema);
export default Story;