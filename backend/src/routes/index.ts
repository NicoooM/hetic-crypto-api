import express from "express";
import { authRouter } from "./auth";
import { walletRouter } from "./wallet";
import { historyRouter } from "./history";
import { portfolioRouter } from "./portfolio";
import { profileRouter } from "./profile";
export const router = express.Router();

router.use("/auth", authRouter);
router.use("/wallet", walletRouter);
router.use("/history", historyRouter);
router.use("/portfolio", portfolioRouter);
router.use("/profile", profileRouter);
