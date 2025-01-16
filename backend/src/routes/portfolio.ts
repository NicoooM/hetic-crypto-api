import { Router } from "express";
import { PortfolioController } from "controllers/portfolio.controller";

const portfolioRouter = Router();
const portfolioController = new PortfolioController();

portfolioRouter.get("/:id", portfolioController.get);

export { portfolioRouter };
