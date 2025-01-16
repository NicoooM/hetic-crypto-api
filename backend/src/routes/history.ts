import { Router } from "express";
import { HistoryController } from "controllers/history.controller";

const historyRouter = Router();
const historyController = new HistoryController();

historyRouter.get("/:id", historyController.get);

export { historyRouter };
