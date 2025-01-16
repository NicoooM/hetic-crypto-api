import type { Request, Response } from "express";
import { HistoryService } from "services/history.service";

export class HistoryController {
  #historyService: HistoryService;

  constructor() {
    this.#historyService = new HistoryService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id, 10);
      const { startDate } = req.query;

      if (isNaN(walletId)) {
        res.status(400).json({ error: "Invalid wallet id" });
      }

      const history = await this.#historyService.get(walletId, startDate);

      if (history.length === 0) {
        res.status(404).json({ error: "Wallet history not found" });
      }

      res.json(history);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
