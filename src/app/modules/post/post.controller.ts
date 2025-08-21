import { handleZodValidation } from "../../middlewares/handleZodValidation";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import postServices from "./post.service";
import { updatePostValidationSchema } from "./post.validation";

const createPost = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req?.body?.payload || "{}");
  const result = await postServices.createPost(req.user.id, payload, req.files);
  successResponse(res, {
    message: "Post created successfully!",
    data: result,
    status: 201,
  });
});

const getAllPosts = handleAsyncRequest(async (req: any, res) => {
  const query = req.query;
  const result = await postServices.getAllPosts(query, req.user.id);
  successResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const getSinglePost = handleAsyncRequest(async (req, res) => {
  const id = req.params.id
  const result = await postServices.getSinglePost(id);
  successResponse(res, {
    message: "Post retrieved successfully!",
    data: result,
  });
});

const addNotInterested = handleAsyncRequest(async (req: any, res) => {
  const post = req?.body?.postId;
  const result = await postServices.addNotInterested(post, req.user.id);
  successResponse(res, {
    message: "User added to not interested list successfully!",
    data: result,
  });
});

const addOrRemoveReaction = handleAsyncRequest(async (req: any, res) => {
  const post = req?.body?.postId;
  const email = req?.user.email;
  const { result, added } = await postServices.addOrRemoveReaction(post, email);
  successResponse(res, {
    message: `Reaction ${added ? "added" : "removed"} to the post successfully!`,
    data: result,
  });
});


const updatePost = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const imageFiles = req.files;

  let images: string[] = [];
  if (imageFiles && imageFiles.length) {
    images = (imageFiles as any[])?.map((file: any) => file.location);
  }

  const textData = JSON.parse(req?.body?.payload || "{}");

  const payload = {
    ...textData,
  };

  if (images.length > 0) {
    payload.images = images;
  }

  handleZodValidation(updatePostValidationSchema);

  const result = await postServices.updatePost(id, payload);
  successResponse(res, {
    message: "Post updated successfully!",
    data: result
  });
});

const removePostImage = handleAsyncRequest(async (req: any, res) => {
  const result = await postServices.removePostImage(req.params.id, req.body.image);
  successResponse(res, {
    message: "Post image removed successfully!",
    data: result,
  });
});

const getPostsForGuest = handleAsyncRequest(async (req: any, res) => {
  const query = req.query;
  const result = await postServices.getPostsForGuest(query);
  successResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const getMyPosts = handleAsyncRequest(async (req: any, res) => {
  const result = await postServices.getMyPosts(req.user.id, req.query);
  successResponse(res, {
    message: "Posts retrieved successfully!",
    data: result,
  });
});

const removePost = handleAsyncRequest(async (req, res) => {
  const id = req?.params.id;
  const result = await postServices.removePost(id);
  successResponse(res, {
    message: "Post deleted successfully!",
    data: result,
  });
});

const postControllers = {
  createPost,
  getAllPosts,
  addNotInterested,
  removePost,
  getSinglePost,
  updatePost,
  addOrRemoveReaction,
  getPostsForGuest,
  getMyPosts,
  removePostImage,
};

export default postControllers;
