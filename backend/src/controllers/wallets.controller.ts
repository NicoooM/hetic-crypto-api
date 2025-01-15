import type { Request, Response } from "express";
import { WalletsService } from "services/wallets.service";

export class WalletsController {
  #walletsService: WalletsService;

  constructor() {
    this.#walletsService = new WalletsService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const wallets = await this.#walletsService.get();
      res.json(wallets);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
