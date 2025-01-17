import { AuthController } from "controllers/auth.controller";
import express from "express";
import { loginLimiter } from "middleware/rate-limiter";
import { registerLimiter } from "middleware/rate-limiter";

const authRouter = express.Router();
const authController = new AuthController();

authRouter.post("/login", loginLimiter, authController.login);
authRouter.post("/register", registerLimiter, authController.register);
authRouter.post("/refresh-access-token", authController.refreshAccessToken);
authRouter.get("/verify-email/:token", authController.verifyEmail);
authRouter.post("/logout", authController.logout);

export { authRouter };
