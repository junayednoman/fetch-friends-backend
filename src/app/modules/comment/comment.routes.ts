import { Router } from "express";
import commentController from "./comment.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { commentZodSchema } from "./comment.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.petOwner, userRoles.careBuddy, userRoles.businessPartner]),
  handleZodValidation(commentZodSchema),
  commentController.createComment
);

router.get(
  "/:postId",
  authVerify([userRoles.petOwner, userRoles.careBuddy, userRoles.admin]),
  commentController.getCommentsByPostId
);

router.put(
  "/:commentId",
  authVerify([userRoles.petOwner, userRoles.careBuddy, userRoles.admin]),
  handleZodValidation(commentZodSchema.partial()),
  commentController.editComment
);

router.delete(
  "/:commentId",
  authVerify([userRoles.petOwner, userRoles.careBuddy, userRoles.admin]),
  commentController.deleteComment
);

export const commentRoutes = router;