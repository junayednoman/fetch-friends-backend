import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import categoryControllers from "./category.controller";
import { upload } from "../../utils/multerS3Uploader";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import { categoryCreateValidationSchema, updateCategoryValidationSchema } from "./category.validation";
import { userRoles } from "../../constants/global.constant";
const categoryRoutes = Router();

categoryRoutes.post(
  "/",
  authVerify([userRoles.admin]),
  upload.single("image"),
  handleZodValidation(categoryCreateValidationSchema, true),
  categoryControllers.createCategory
);

categoryRoutes.get("/", categoryControllers.getAllCategories);

categoryRoutes.get(
  "/:id",
  authVerify([userRoles.admin, userRoles.careBuddy, userRoles.businessPartner, userRoles.careBuddy]),
  categoryControllers.getSingleCategory
);

categoryRoutes.put(
  "/:id",
  authVerify([userRoles.admin]),
  upload.single("image"),
  handleZodValidation(updateCategoryValidationSchema, true),
  categoryControllers.updateCategory
);

categoryRoutes.delete(
  "/:id",
  authVerify([userRoles.admin]),
  categoryControllers.deleteCategory
);

export default categoryRoutes;
