import type { Request, Response } from "express";
import { ProfileService } from "services/profile.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
    } catch {
      res.status(500).json({ error: "Internal server error" });
    }
  };

  edit = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      const parsedData = registerSchema.parse({ name, email, password });

      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
      }

      const user = await this.#profileService.edit(parsedData);
      res.status(200).json(user);
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        res.status(400).json({ error: "Account edition failed" });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  };
}
