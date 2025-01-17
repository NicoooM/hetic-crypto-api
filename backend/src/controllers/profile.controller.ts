import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ProfileService } from "services/profile.service";
import { registerSchema } from "schemas/auth.schemas";

export class ProfileController {
  #profileService: ProfileService;

  constructor() {
    this.#profileService = new ProfileService();
  }

  get = async (req: Request, res: Response) => {
    try {
      const profile = await this.#profileService.get();
      res.json(profile);
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const parsedData = registerSchema.parse({ name, email, password });

      if (!email || !password) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Email and password are required" });
      }

      const user = await this.#profileService.edit(parsedData);
      res.status(StatusCodes.OK).json(user);
    } catch (error: any) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ error: "Account edition failed" });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  };
}
