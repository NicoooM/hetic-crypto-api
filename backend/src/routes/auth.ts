import { AuthController } from "controllers/auth.controller";
import express from "express";
import { verifyAccessToken } from "middleware/auth";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/login", authController.login);
authRouter.post("/profile", verifyAccessToken, () => {});

authRouter.post("/register", authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/logout", authController.logout);

export { authRouter };
