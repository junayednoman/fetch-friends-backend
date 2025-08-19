import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { businessPartnerZodSchema } from "./businessPartner.validation";
import businessPartnerController from "./businessPartner.controller";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { upload } from "../../utils/multerS3Uploader";

const router = Router();

router.post("/", handleZodValidation(businessPartnerZodSchema), businessPartnerController.signUpBusinessPartner);
router.get("/", authVerify([userRoles.admin, userRoles.businessPartner]), businessPartnerController.getAllBusinessPartners);
router.get("/profile", authVerify([userRoles.businessPartner]), businessPartnerController.getBusinessPartnerProfile);
router.get("/:id", authVerify([userRoles.admin, userRoles.businessPartner]), businessPartnerController.getSingleBusinessPartner);
router.put(
  "/",
  authVerify([userRoles.businessPartner]),
  upload.fields([{ name: "image", maxCount: 1 }]),
  handleZodValidation(businessPartnerZodSchema.partial(), true),
  businessPartnerController.updateBusinessPartnerProfile
);

export const businessPartnerRoutes = router;