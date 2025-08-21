import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { storyServices } from "./story.service";

const createStory = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req?.body?.payload || '{}');
  const result = await storyServices.createStory(req.user.id, payload, req.file);

  successResponse(res, {
    message: "Story created successfully!",
    data: result,
    status: 201,
  });
})

const getMyStories = handleAsyncRequest(async (req: any, res) => {
  const query = req.query;
  const result = await storyServices.getMyStories(req.user.id, query);

  successResponse(res, {
    message: "Stories retrieved successfully!",
    data: result,
  });
})

const getAllStoryAuthors = handleAsyncRequest(async (req: any, res) => {
  const result = await storyServices.getAllStoryAuthors();
  successResponse(res, {
    message: "Story users retrieved successfully!",
    data: result,
  });
})

const getStoryByAuthorId = handleAsyncRequest(async (req: any, res) => {
  const result = await storyServices.getStoryByAuthorId(req.params.authorId);
  successResponse(res, {
    message: "Stories retrieved successfully!",
    data: result,
  });
})

const getSingleStory = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const result = await storyServices.getSingleStory(id);

  successResponse(res, {
    message: "Story retrieved successfully!",
    data: result,
  });
})

const updateStory = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req?.body?.payload || '{}');
  const result = await storyServices.updateStory(req.params.id, payload, req.file);

  successResponse(res, {
    message: "Story updated successfully!",
    data: result
  });
})

const addOrRemoveReaction = handleAsyncRequest(async (req: any, res) => {
  const result = await storyServices.addOrRemoveReaction(req.params.storyId, req.user.id);
  successResponse(res, {
    message: "User added to not interested list successfully successfully!",
    data: result
  });
})

const deleteStory = handleAsyncRequest(async (req: any, res) => {
  const id = req.params.id;
  const result = await storyServices.deleteStory(id);

  successResponse(res, {
    message: "Story deleted successfully!",
    data: result
  });
})


export const storyControllers = {
  createStory,
  getMyStories,
  getSingleStory,
  getAllStoryAuthors,
  getStoryByAuthorId,
  updateStory,
  addOrRemoveReaction,
  deleteStory
};