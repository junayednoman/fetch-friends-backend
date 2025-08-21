import mongoose, { ObjectId } from "mongoose";
import { AppError } from "../../classes/appError";
import TStory from "./story.interface";
import Story from "./story.model";
import QueryBuilder from "../../classes/queryBuilder";
import Auth from "../auth/auth.model";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import { TFile } from "../../../interface/file.interface";
import deleteLocalFile from "../../utils/deleteLocalFile";

const createStory = async (userId: string, payload: TStory, file: TFile) => {
  payload.image = await uploadToS3(file);
  payload.author = userId as unknown as ObjectId;
  const result = await Story.create(payload);
  return result;
};

const getMyStories = async (userId: string, query: Record<string, any>) => {
  const searchableFields = [
    "caption"
  ];
  const storyQuery = new QueryBuilder(
    Story.find({
      author: userId,
      isDeleted: false,
    }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await storyQuery.countTotal();
  const result = await storyQuery.queryModel;
  return { data: result, meta };
};

const getAllStoryAuthors = async () => {
  const storyAuthors = await Story.aggregate([
    {
      $group: {
        _id: "$author",
      },
    },
    {
      $lookup: {
        from: "auths",
        localField: "_id",
        foreignField: "_id",
        as: "auth"
      }
    },
    { $unwind: "$auth" },
    {
      $lookup: {
        from: "petowners",
        localField: "auth.user",
        foreignField: "_id",
        as: "petowner"
      }
    },
    {
      $lookup: {
        from: "carebuddies",
        localField: "auth.user",
        foreignField: "_id",
        as: "carebuddy"
      }
    },
    {
      $addFields: {
        userData: {
          $cond: [
            { $eq: ["$auth.role", "PetOwner"] },
            { $arrayElemAt: ["$petowner", 0] },
            { $arrayElemAt: ["$carebuddy", 0] }
          ]
        }
      }
    },
    {
      $project: {
        auth: 0,
        petowner: 0,
        carebuddy: 0,

      }
    },
    {
      $project: {
        "userData.name": 1,
        "userData.image": 1,
      }
    }
  ]);

  return storyAuthors;


};

const getStoryByAuthorId = async (authorId: string) => {
  const result = await Story.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(authorId),
      }
    }, {
      $addFields: {
        isLiked: {
          $cond: {
            if: { $in: [new mongoose.Types.ObjectId(authorId), "$reactions"] },
            then: true,
            else: false
          }
        }
      }
    }
  ])
  return result;
}

const getSingleStory = async (id: string) => {
  const result = await Story.findById(id);
  return result;
};

const addOrRemoveReaction = async (storyId: string, userId: string) => {
  const post = await Story.findById(storyId)
  if (!post) throw new AppError(404, "Story not found");
  const user = await Auth.findById(userId);
  if (!user) throw new AppError(401, "Unauthorized!");

  if (post.reactions?.includes(user._id as unknown as ObjectId)) {
    const result = await Story.findByIdAndUpdate(
      storyId,
      { $pull: { reactions: user?._id } },
      { new: true }
    );
    return { result };
  } else {
    const result = await Story.findByIdAndUpdate(
      storyId,
      { $addToSet: { reactions: user?._id } },
      { new: true }
    );
    return { result, added: true };
  }
};

const updateStory = async (id: string, payload: TStory, file?: TFile) => {
  const story = await Story.findById(id);
  if (!story) {
    if (file) await deleteLocalFile(file.path)
    throw new AppError(404, "Invalid story id!");
  }
  if (file) payload.image = await uploadToS3(file);
  const result = await Story.findByIdAndUpdate(id, payload, { new: true });
  if (result && file) deleteFileFromS3(story.image);
  return result;
};

const deleteStory = async (id: string) => {
  const story = await Story.findById(id);
  if (!story) throw new AppError(404, "Story not found!");
  const result = await Story.findByIdAndDelete(id, { new: true });
  if (result) deleteFileFromS3(story.image);
  return result;
};

export const storyServices = {
  createStory,
  getMyStories,
  getStoryByAuthorId,
  getSingleStory,
  updateStory,
  addOrRemoveReaction,
  deleteStory,
  getAllStoryAuthors
};