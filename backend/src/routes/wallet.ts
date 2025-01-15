import { Router } from "express";
import { WalletController } from "controllers/wallet.controller";

const walletRouter = Router();
const walletController = new WalletController();

walletRouter.delete("/:id", walletController.delete);
walletRouter.post("/", walletController.create);
walletRouter.get("/", walletController.all);

export { walletRouter };
