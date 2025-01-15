import { WalletsController } from "controllers/wallets.controller";
import { Router } from "express";

const walletsRouter = Router();
const walletsController = new WalletsController();

walletsRouter.get("/", walletsController.get);

export { walletsRouter };
