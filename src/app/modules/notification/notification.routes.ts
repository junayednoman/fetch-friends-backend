import { Router } from "express";
import authVerify from "../../middlewares/authVerify";
import { notificationController } from "./notification.controller";
import { userRoles } from "../../constants/global.constant";

const notificationRoutes = Router();

notificationRoutes.post("/", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]), notificationController.createNotification)
notificationRoutes.get("/", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]), notificationController.getAllNotifications)

notificationRoutes.patch(
  "/mark-all-as-read", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]),
  notificationController.markAllAsRead)

notificationRoutes.get("/unread-count", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]), notificationController.getUnreadNotificationCount)

notificationRoutes.delete("/:id", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]), notificationController.deleteSingleNotification)

notificationRoutes.delete("/", authVerify([userRoles.admin, userRoles.companyAdmin, userRoles.employee]), notificationController.deleteMyNotifications)

export default notificationRoutes;