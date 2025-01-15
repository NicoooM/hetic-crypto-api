import type { Request, Response } from "express";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { WalletService } from "services/wallet.service";

export class WalletController {
  #walletService: WalletService;

  constructor() {
    this.#walletService = new WalletService();
  }

  delete = async (req: Request, res: Response) => {
    try {
      const walletId = parseInt(req.params.id, 10);

      if (isNaN(walletId)) {
        res.status(400).json({ error: "Invalid wallet id" });
      }

      await this.#walletService.delete(walletId);
      res.status(204).send();
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        res.status(404).json({ error: "Wallet not found" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const { address, title } = req.body;

      if (!address || !title) {
        res.status(400).json({ error: "Address and title are required" });
      }

      const wallet = await this.#walletService.create(address, title);
      res.status(201).json(wallet);
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
