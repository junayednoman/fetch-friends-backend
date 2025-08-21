import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import { reelsServices } from "./reels.service";

const createReel = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req?.body?.payload || '{}');
  const result = await reelsServices.createReel(req.user.id, payload, req.file);

  successResponse(res, {
    message: "Reel created successfully!",
    data: result,
    status: 201,
  });
});

const getAllReels = handleAsyncRequest(async (req: any, res) => {
  const query = req.query;
  const result = await reelsServices.getAllReels(query, req.user.id);
  successResponse(res, {
    message: "All reels retrieved successfully!",
    data: result,
  });
})

const getSingleReel = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await reelsServices.getSingleReel(id);
  successResponse(res, {
    message: "Reel retrieved successfully!",
    data: result,
  });
})

const updateReel = handleAsyncRequest(async (req, res) => {
  const payload = JSON.parse(req?.body?.payload || "{}");
  const result = await reelsServices.updateReel(req.params.id, payload, req.file);
  successResponse(res, {
    message: "Reel updated successfully!",
    data: result,
  });
})

const addOrRemoveReactionToReel = handleAsyncRequest(async (req: any, res) => {
  const reelId = req?.params?.reelId;
  const { result, added } = await reelsServices.addOrRemoveReactionToReel(reelId, req.user.id);
  successResponse(res, {
    message: `Reaction ${added ? "added" : "removed"} to the reel successfully!`,
    data: result,
  });
});

const deleteReel = handleAsyncRequest(async (req, res) => {
  const id = req.params.id;
  const result = await reelsServices.deleteReel(id);
  successResponse(res, {
    message: "Reel deleted successfully!",
    data: result,
  });
})

export const reelControllers = {
  createReel,
  getAllReels,
  getSingleReel,
  updateReel,
  deleteReel,
  addOrRemoveReactionToReel
}