import mongoose, { ObjectId } from "mongoose";
import { AppError } from "../../classes/appError";
import Auth from "../auth/auth.model";
import Category from "../category/category.model";
import { TPost } from "./post.interface";
import Post from "./post.model";
import QueryBuilder from "../../classes/queryBuilder";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import { TFile } from "../../../interface/file.interface";
import deleteLocalFile from "../../utils/deleteLocalFile";
import { TCreatePost } from "./post.validation";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import AggregationBuilder from "../../classes/AggregationBuilder";

const createPost = async (userId: string, payload: TCreatePost, files: TFile[]) => {
  const category = await Category.findOne({
    _id: payload.category,
  });
  if (!category) {
    if (files?.length > 0) {
      files.map(async (file: TFile) => await deleteLocalFile(file.filename));
    }
    throw new AppError(404, "Category not found!");
  }
  const images = [];
  for (const file of files) {
    const image = await uploadToS3(file);
    images.push(image);
  }
  payload.author = userId;
  payload.images = images;
  const result = await Post.create(payload);
  return result;
};

const getAllPosts = async (query: Record<string, any>, userId: string) => {
  if (query.category) {
    query.category = new mongoose.Types.ObjectId(query.category);
  }
  if (query.author) {
    query.author = new mongoose.Types.ObjectId(query.author);
  }
  query.isDeleted = false;
  query.isBlocked = false;
  const searchableFields = ["caption", "location", "images"];
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
    },
    {
      $match: {
        notInterests: { $nin: [new mongoose.Types.ObjectId(userId)] }
      }
    }
  ]

  const postQuery = new AggregationBuilder(Post, pipeline, query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.execute().then((docs) =>
    Post.populate(docs, { path: "author", select: "name image location" })
  );

  return { data: result, meta };
};

const getPostsForGuest = async (query: Record<string, any>) => {
  const searchableFields = [
    "caption",
    "location"
  ];
  const postQuery = new QueryBuilder(
    Post.find(),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.queryModel.populate("author", "name image location");
  return { data: result, meta };
};

const getMyPosts = async (userId: string, query: Record<string, any>) => {
  const searchableFields = [
    "caption",
    "location"
  ];
  const postQuery = new QueryBuilder(
    Post.find({ author: userId, isDeleted: false, isBlocked: false }),
    query
  )
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await postQuery.countTotal();
  const result = await postQuery.queryModel.populate("author", "name image location");
  return { data: result, meta };
}

const getSinglePost = async (id: string) => {
  const result = await Post.findOne({ _id: id, isDeleted: false }).populate("author", "name image").populate("category", "name");
  return result;
};

const updatePost = async (id: string, payload: TPost) => {
  const post = await Post.findOne({ _id: id, isDeleted: false });
  if (!post) {
    if (payload.images) {
      payload.images.map(async (image: string) => await deleteFileFromS3(image));

    }
    throw new AppError(404, "Post not found");
  }

  if (payload.category) {
    const category = await Category.findOne({ _id: payload.category, status: "active" });
    if (!category) {
      // delete the newly uploaded image if category does not exist
      if (payload.images
        && payload.images.length > 0
      ) {
        payload.images.map(async (image: string) => await deleteFileFromS3(image));
      }
      throw new AppError(404, "Category not found!");
    }
  }
  const result = await Post.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
}

const removePostImage = async (postId: string, image: string) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new AppError(404, "Post not found");
  const images = post.images?.filter((img) => img !== image);
  const result = await Post.findOneAndUpdate(
    { _id: postId },
    { images },
    { new: true }
  );
  if (result) {
    await deleteFileFromS3(image);
  }
  return result;
}

const addNotInterested = async (postId: string, userId: string) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new AppError(404, "Post not found");
  const user = await Auth.findOne({ _id: userId, isDeleted: false });
  if (!user) throw new AppError(404, "User not found");
  const result = await Post.findOneAndUpdate(
    { _id: postId },
    { $addToSet: { notInterests: userId } },
    { new: true }
  );
  return result;
};

const addOrRemoveReaction = async (postId: string, email: string) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new AppError(404, "Post not found");
  const user = await Auth.findOne({ email, isDeleted: false });
  if (!user) throw new AppError(401, "Unauthorized!");

  if (post.reactions?.includes(user._id as unknown as ObjectId)) {
    const result = await Post.findOneAndUpdate(
      { _id: postId },
      { $pull: { reactions: user?._id } },
      { new: true }
    );
    return { result };
  } else {
    const result = await Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { reactions: user?._id } },
      { new: true }
    );
    return { result, added: true };
  }
};

const removePost = async (postId: string) => {
  const post = await Post.findOne({ _id: postId, isDeleted: false });
  if (!post) throw new AppError(404, "Post not found");

  const result = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { isDeleted: true } },
    { new: true }
  )
  return result;
};

const postServices = {
  createPost,
  getAllPosts,
  addNotInterested,
  removePost,
  getSinglePost,
  updatePost,
  addOrRemoveReaction,
  getPostsForGuest,
  removePostImage,
  getMyPosts,
};

export default postServices;
