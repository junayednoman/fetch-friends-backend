import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import Post from "../post/post.model";
import { TComment } from "./comment.interface";
import Comment from "./comment.model";

const createComment = async (payload: TComment) => {
  const post = await Post.findById(payload.post);
  if (!post) throw new AppError(404, "Post not found");
  const result = await Comment.create(payload);
  return result;
};

const getCommentsByPostId = async (query: Record<string, any>, postId: string) => {
  query.post = postId;
  const searchableFields = ["text"];

  const partnerQuery = new QueryBuilder(Comment.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await partnerQuery.countTotal();
  const result = await partnerQuery.queryModel.populate([
    {
      path: "author", select: "user role",
      populate: { path: "user", select: "name image" }
    },
  ]);;
  return { data: result, meta };
};

const editComment = async (commentId: string, payload: { text: string }, userId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError(404, "Comment not found");
  if (comment.author.toString() !== userId) throw new AppError(403, "Unauthorized to edit this comment");

  const result = await Comment.findByIdAndUpdate(commentId, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteComment = async (commentId: string, userId: string) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new AppError(404, "Comment not found");
  if (comment.author.toString() !== userId) throw new AppError(403, "Unauthorized to delete this comment");

  const result = await Comment.findByIdAndDelete(commentId);
  return result;
};

const commentService = {
  createComment,
  getCommentsByPostId,
  editComment,
  deleteComment,
};

export default commentService;