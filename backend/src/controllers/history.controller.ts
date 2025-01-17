import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { filtersSchema } from "schemas/filters.schemas";
import { HistoryService } from "services/history.service";

export class HistoryController {
  #historyService: HistoryService;

  constructor() {
    this.#historyService = new HistoryService();
  }

  get = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const walletId = parseInt(req.params.id, 10);
        const { startDate } = req.query;

        if (isNaN(walletId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid wallet id" });
        }

        const parsedId = parseInt(req.user.id);
        const parsedData = filtersSchema.parse({
          walletId,
          wallet: {
            user: {
              id: parsedId,
            },
          },
          ...(startDate && { date: { gte: new Date(startDate as string) } }),
        });

        const history = await this.#historyService.get(parsedData);

        if (history.length === 0) {
          res
            .status(StatusCodes.NOT_FOUND)
            .json({ error: "Wallet history not found" });
        }

        res.json(history);
      }
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}
