import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import postControllers from "./post.controller";
import { upload } from "../../utils/multerS3Uploader";
import { userRoles } from "../../constants/global.constant";

const postRoutes = Router();

postRoutes.post(
  "/",
  authVerify([userRoles.petOwner, userRoles.careBuddy]),
  upload.array("images", 8),
  postControllers.createPost
);

postRoutes.get("/", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.getAllPosts);
postRoutes.get("/guest", postControllers.getPostsForGuest);
postRoutes.get("/my", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.getMyPosts);
postRoutes.get("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.getSinglePost);
postRoutes.put("/interests", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.addNotInterested);
postRoutes.put("/reactions", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.addOrRemoveReaction);
postRoutes.put("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), upload.array("images", 8), postControllers.updatePost);
postRoutes.patch("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.removePostImage);
postRoutes.delete("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), postControllers.removePost);

export default postRoutes;
