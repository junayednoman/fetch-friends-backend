import { Router } from "express";
import PetOwnerController from "./petOwner.controller";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { petOwnerUpdateValidationSchema, petOwnerValidationSchema } from "./petOwner.validation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/multerS3Uploader";

const router = Router();

router.post("/", handleZodValidation(petOwnerValidationSchema), PetOwnerController.signUpPetOwner);
router.get("/", authVerify([userRoles.admin, userRoles.petOwner]), PetOwnerController.getAllPetOwners)
router.get("/profile", authVerify([userRoles.petOwner]), PetOwnerController.getPetOwnerProfile)
router.get("/:id", authVerify([userRoles.admin, userRoles.petOwner, userRoles.careBuddy]), PetOwnerController.getSinglePetOwner)
router.put("/", authVerify([userRoles.petOwner]), upload.fields([
  { name: "image", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
  { name: "petOwnerImage", maxCount: 1 }
]), handleZodValidation(petOwnerUpdateValidationSchema, true), PetOwnerController.updatePetOwnerProfile)

export const petOwnerRoutes = router;

