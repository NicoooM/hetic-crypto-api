import { AuthService } from "services/auth.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { registerSchema } from "schemas/auth.schemas";
import z from "zod";

export class AuthController {
  #authService: AuthService;

  constructor() {
    this.#authService = new AuthService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;

      const parsedData = registerSchema.parse({ name, email, password });

      await this.#authService.register(parsedData);

      res.status(StatusCodes.CREATED).json({
        message: "Registration successful. Please verify your email.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ message: error.message });
      }
    }
  };

  async verifyEmail(
    req: Request & { params: { token: string } },
    res: Response
  ) {
    const { token } = req.params;
    console.log(token);
    // await this.#authService.verifyEmail(token);
  }
}
