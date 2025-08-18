import { Router } from "express";
import authRouters from "../modules/auth/auth.routes";
import adminRouters from "../modules/admin/admin.routes";
import { legalRoutes } from "../modules/legal/legal.routes";
import notificationRouters from "../modules/notification/notification.routes";
import { uploadFileRoutes } from "../modules/uploadFile/uploadFile.routes";
import categoryRoutes from "../modules/category/category.routes";
import chatRoutes from "../modules/chat/chat.routes";
import messageRoutes from "../modules/message/message.routes";
import summaryRouters from "../modules/summary/summary.routes";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: authRouters },
  { path: "/admins", route: adminRouters },
  { path: "/categories", route: categoryRoutes },
  { path: "/chats", route: chatRoutes },
  { path: "/messages", route: messageRoutes },
  { path: "/legal", route: legalRoutes },
  { path: "/notifications", route: notificationRouters },
  { path: "/upload-files", route: uploadFileRoutes },
  { path: "/summary", route: summaryRouters },
];

apiRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;