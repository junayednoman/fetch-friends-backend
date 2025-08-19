import { Router } from "express";
import { handleZodValidation } from "../../middlewares/handleZodValidation";
import {
  changePasswordValidationSchema,
  emailValidationSchema,
  loginUserValidationSchema,
  resetForgottenPasswordSchema,
  verifyOtpSchema,
} from "./auth.validation";
import AuthController from "./auth.controller";
import authVerify from "../../middlewares/authVerify";
import { userRoles } from "../../constants/global.constant";

const authRoutes = Router();

authRoutes.post(
  "/login",
  handleZodValidation(loginUserValidationSchema),
  AuthController.loginUser
);
authRoutes.post(
  "/logout",
  authVerify([userRoles.admin, userRoles.petOwner, userRoles.careBuddy, userRoles.businessPartner]),
  AuthController.logOut
);
authRoutes.post(
  "/send-otp",
  handleZodValidation(emailValidationSchema),
  AuthController.sendOtp
);
authRoutes.post(
  "/verify-otp",
  handleZodValidation(verifyOtpSchema),
  AuthController.verifyOtp
);
authRoutes.post(
  "/reset-forgotten-password",
  handleZodValidation(resetForgottenPasswordSchema),
  AuthController.resetForgottenPassword
);
authRoutes.post(
  "/change-password",
  authVerify([userRoles.admin, userRoles.petOwner, userRoles.careBuddy, userRoles.businessPartner]),
  handleZodValidation(changePasswordValidationSchema),
  AuthController.changePassword
);
authRoutes.get(
  "/refresh-token",
  AuthController.getNewAccessToken
);
authRoutes.patch(
  "/change-status/:id",
  authVerify([userRoles.admin]),
  AuthController.changeUserStatus
)
authRoutes.delete("/", authVerify([userRoles.petOwner, userRoles.careBuddy, userRoles.businessPartner]), AuthController.deleteUser)

export default authRoutes;
