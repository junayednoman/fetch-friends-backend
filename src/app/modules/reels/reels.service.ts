import mongoose, { ObjectId } from "mongoose";
import { TReels } from "./reels.interface";
import { AppError } from "../../classes/appError";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import { TFile } from "../../../interface/file.interface";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import AggregationBuilder from "../../classes/AggregationBuilder";
import Reel from "./reels.model";
import deleteLocalFile from "../../utils/deleteLocalFile";

const createReel = async (userId: ObjectId, payload: TReels, file: TFile) => {
  payload.author = userId;
  if (!file) throw new AppError(400, "Video is required!");
  payload.video = await uploadToS3(file);
  if (!payload.video) throw new AppError(400, "Error uploading video!");
  const result = await Reel.create(payload);
  return result;
}

const getMyReels = async (userId: string) => {
  const reels = await Reel.find({ author: userId }).populate([
    {
      path: "author", select: "user role",
      populate: { path: "user", select: "name image" }
    },
  ]);
  return reels;
}

const getAllReels = async (query: Record<string, any>, userId: string) => {
  if (query.author) {
    query.author = new mongoose.Types.ObjectId(query.author);
  }
  const searchableFields = ["caption"];
  const pipeline = [
    {
      $addFields: {
        isLiked: {
          $cond: {
            if: { $in: [new mongoose.Types.ObjectId(userId), "$reactions"] },
            then: true,
            else: false
          }
        }
      }
    }
  ]

  const postQuery = new AggregationBuilder(Reel, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.execute().then((docs) =>
    Reel.populate(docs, {
      path: "author", select: "user role",
      populate: { path: "user", select: "name image location" }
    })
  );

  return { data: result, meta };
};

const getSingleReel = async (id: string) => {
  const reel = await Reel.findOne({ _id: id });
  return reel;
}

const updateReel = async (id: string, payload: TReels, file?: TFile) => {
  const reel = await Reel.findOne({ _id: id });
  if (!reel) {
    if (file) await deleteLocalFile(file.filename);
    throw new AppError(404, "Reel not found!");
  }
  if (file) payload.video = await uploadToS3(file);
  const result = await Reel.findByIdAndUpdate(id, payload, { new: true });
  if (result && payload.video) await deleteFileFromS3(reel.video);
  return result;
}

const addOrRemoveReactionToReel = async (reelId: string, userId: string) => {
  const reel = await Reel.findById(reelId);
  if (!reel) throw new AppError(404, "Reel not found");

  if (reel.reactions?.includes(userId as unknown as ObjectId)) {
    const result = await Reel.findByIdAndUpdate(
      reelId,
      { $pull: { reactions: userId } },
      { new: true }
    );
    return { result };
  } else {
    const result = await Reel.findByIdAndUpdate(
      reelId,
      { $addToSet: { reactions: userId } },
      { new: true }
    );
    return { result, added: true };
  }
};

const deleteReel = async (id: string) => {
  const reel = await Reel.findOne({ _id: id });
  if (!reel) throw new AppError(404, "Reel not found!");
  if (reel.video) await deleteFileFromS3(reel.video);
  const result = await Reel.findByIdAndDelete(id, { new: true });
  return result;
}

export const reelsServices = {
  createReel,
  getMyReels,
  getAllReels,
  getSingleReel,
  updateReel,
  deleteReel,
  addOrRemoveReactionToReel
}