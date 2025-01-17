import express from "express";
import { verifyAccessToken } from "middleware/auth";
import { authRouter } from "./auth";
import { walletRouter } from "./wallet";
import { historyRouter } from "./history";
import { portfolioRouter } from "./portfolio";
import { profileRouter } from "./profile";
export const router = express.Router();

router.use("/auth", authRouter);
router.use("/wallet", verifyAccessToken, walletRouter);
router.use("/history", verifyAccessToken, historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", verifyAccessToken, profileRouter);
