import { AuthController } from "controllers/auth.controller";
import express from "express";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/logout", authController.logout);

export { authRouter };
