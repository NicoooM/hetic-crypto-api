import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { WalletService } from "services/wallet.service";
import { walletSchema } from "schemas/wallet.schemas";

export class WalletController {
  #walletService: WalletService;

  constructor() {
    this.#walletService = new WalletService();
  }

  delete = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const walletId = parseInt(req.params.id, 10);
        const userId = parseInt(req.user.id);

        if (isNaN(walletId)) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Invalid wallet id" });
        }

        await this.#walletService.delete(walletId, userId);
        res.status(StatusCodes.NO_CONTENT).send();
      }
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        res.status(StatusCodes.NOT_FOUND).json({ error: "Wallet not found" });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const { address, title } = req.body;
        const parsedData = walletSchema.parse({ address, title });
        const parsedId = parseInt(req.user.id);

        if (!address || !title) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Address and title are required" });
        }

        const wallet = await this.#walletService.create({
          ...parsedData,
          id: parsedId,
        });
        res.status(StatusCodes.CREATED).json(wallet);
      }
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  all = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const parsedId = parseInt(req.user.id);
        const wallets = await this.#walletService.all(parsedId);
        res.json(wallets);
      }
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };
}
