import { AuthController } from "controllers/auth.controller";
import express from "express";

const authRouter = express.Router();
const authController = new AuthController();

// router.post("/auth/login", authController.login);
// router.post("/auth/logout", authController.logout);

// router.post("/auth/refresh", authController.refresh);

// authRouter.get("/test", (req, res) => {
//   res.send("Hello World! From Auth");
// });

// authRouter.get("verify-email/:token", authController.verifyEmail);

authRouter.post("/register", authController.register);
authRouter.get("/verify-email/:token", authController.verifyEmail);

export { authRouter };
