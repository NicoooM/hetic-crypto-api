import { ProfileController } from "controllers/profile.controller";
import { Router } from "express";

const profileRouter = Router();
const profileController = new ProfileController();

profileRouter.get("/", profileController.get);
profileRouter.patch("/", profileController.edit);

export { profileRouter };
