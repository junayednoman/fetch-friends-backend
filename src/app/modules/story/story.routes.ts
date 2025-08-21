import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import storyValidationSchema from "./story.validation";
import { storyControllers } from "./story.controller";
import { upload } from "../../utils/multerS3Uploader";
import { userRoles } from "../../constants/global.constant";

const storyRoutes = Router();

storyRoutes.post("/", authVerify([userRoles.petOwner, userRoles.careBuddy]), upload.single("image"), handleZodValidation(storyValidationSchema, true), storyControllers.createStory);
storyRoutes.get("/my", authVerify([userRoles.petOwner, userRoles.careBuddy]), handleZodValidation(storyValidationSchema, true), storyControllers.getMyStories);
storyRoutes.get("/story-authors", storyControllers.getAllStoryAuthors);
storyRoutes.get("/:authorId", storyControllers.getStoryByAuthorId);
storyRoutes.get("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), storyControllers.getSingleStory);
storyRoutes.patch("/reactions/:storyId", authVerify([userRoles.petOwner, userRoles.careBuddy]), storyControllers.addOrRemoveReaction);
storyRoutes.put("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), upload.single("image"), handleZodValidation(storyValidationSchema, true), storyControllers.updateStory);
storyRoutes.delete("/:id", authVerify([userRoles.petOwner, userRoles.careBuddy]), storyControllers.deleteStory);

export default storyRoutes;