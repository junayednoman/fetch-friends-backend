import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import commentService from "./comment.service";

const createComment = handleAsyncRequest(async (req: any, res) => {
  const payload = req.body;
  payload.author = req.user.id;
  const result = await commentService.createComment(payload);
  successResponse(res, {
    message: "Comment created successfully!",
    data: result,
    status: 201,
  });
});

const getCommentsByPostId = handleAsyncRequest(async (req: any, res) => {
  const result = await commentService.getCommentsByPostId(req.query, req.params.postId);
  successResponse(res, {
    message: "Comments retrieved successfully!",
    data: result,
  });
});

const editComment = handleAsyncRequest(async (req: any, res) => {
  const result = await commentService.editComment(req.params.commentId, req.body, req.user.id);
  successResponse(res, {
    message: "Comment edited successfully!",
    data: result,
  });
});

const deleteComment = handleAsyncRequest(async (req: any, res) => {
  const result = await commentService.deleteComment(req.params.commentId, req.user.id);
  successResponse(res, {
    message: "Comment deleted successfully!",
    data: result,
  });
});

const commentController = {
  createComment,
  getCommentsByPostId,
  editComment,
  deleteComment,
};

export default commentController;