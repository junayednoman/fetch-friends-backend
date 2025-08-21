import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { reelControllers } from "./reels.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { createReelValidationSchema } from "./reels.validation";
import { upload } from "../../utils/multerS3Uploader";
import { userRoles } from "../../constants/global.constant";

const reelsRoutes = Router();

reelsRoutes.post('/', authVerify([userRoles.petOwner, userRoles.careBuddy]), upload.single("video"), handleZodValidation(createReelValidationSchema, true), reelControllers.createReel)
reelsRoutes.get('/', authVerify([userRoles.petOwner, userRoles.careBuddy]), reelControllers.getAllReels)
reelsRoutes.get('/:id', authVerify([userRoles.petOwner, userRoles.careBuddy]), reelControllers.getSingleReel)
reelsRoutes.put('/:id', authVerify([userRoles.petOwner, userRoles.careBuddy]), upload.single("video"), handleZodValidation(createReelValidationSchema, true), reelControllers.updateReel)
reelsRoutes.patch('/reactions/:reelId', authVerify([userRoles.petOwner, userRoles.careBuddy]), reelControllers.addOrRemoveReactionToReel)
reelsRoutes.delete('/:id', authVerify([userRoles.petOwner, userRoles.careBuddy]), reelControllers.deleteReel)

export default reelsRoutes;