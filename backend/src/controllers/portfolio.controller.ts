import type { Request, Response } from "express";
import { PortfolioService } from "services/portfolio.service";

export class PortfolioController {
  #portfolioService: PortfolioService;

  constructor() {
    this.#portfolioService = new PortfolioService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id, 10);

      const { allocation, priceData, dailyPrice, value, dailyValue } =
        await this.#portfolioService.get(walletId);

      res.json({
        allocation: allocation,
        price: priceData,
        dailyPrice: dailyPrice,
        value: value,
        dailyValue: dailyValue,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
