import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";
import { reportSchema, updateReportSchema } from "./reports.validation";
import reportController from "./reports.controller";

const router = Router();

router.post(
  "/",
  authVerify([userRoles.petOwner, userRoles.careBuddy]),
  handleZodValidation(reportSchema),
  reportController.createReport
);

router.get(
  "/",
  authVerify([userRoles.admin]),
  reportController.getAllReports
);

router.get(
  "/:id",
  authVerify([userRoles.admin]),
  reportController.getReportById
);

router.put(
  "/:id",
  authVerify([userRoles.admin]),
  handleZodValidation(updateReportSchema),
  reportController.updateReport
);

router.delete(
  "/:id",
  authVerify([userRoles.petOwner, userRoles.careBuddy]),
  reportController.deleteReport
);

export const reportRoutes = router;