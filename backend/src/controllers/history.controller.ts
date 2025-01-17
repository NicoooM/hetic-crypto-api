import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { HistoryService } from "services/history.service";

export class HistoryController {
  #historyService: HistoryService;

  constructor() {
    this.#historyService = new HistoryService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id, 10);
      const { startDate }: { startDate?: string } = req.query;

      if (isNaN(walletId)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Invalid wallet id" });
      }

      const history = await this.#historyService.get(walletId, startDate || "");

      if (history.length === 0) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Wallet history not found" });
      }

      res.json(history);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}
