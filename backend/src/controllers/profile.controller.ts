import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ProfileService } from "services/profile.service";
import { profileSchema } from "schemas/profile.schemas";

export class ProfileController {
  #profileService: ProfileService;

  constructor() {
    this.#profileService = new ProfileService();
  }

  get = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const parsedId = parseInt(req.user.id);
        const profile = await this.#profileService.get(parsedId);
        res.json(profile);
      }
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      if (req.user) {
        const { name, email } = req.body;
        const parsedData = profileSchema.parse({ name, email });
        const parsedId = parseInt(req.user.id);

        if (!email) {
          res
            .status(StatusCodes.BAD_REQUEST)
            .json({ error: "Email is required" });
        }

        const user = await this.#profileService.edit({
          ...parsedData,
          id: parsedId,
        });
        res.status(StatusCodes.OK).json(user);
      }
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
