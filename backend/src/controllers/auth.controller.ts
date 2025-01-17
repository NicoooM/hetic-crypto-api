import { AuthService } from "services/auth.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "schemas/auth.schemas";
import z from "zod";
import { JWT_REFRESH_TOKEN_EXPIRATION_TIME } from "../constants";
import { hashToken } from "utils/hash-refresh-token";

export class AuthController {
  #authService: AuthService;

  constructor() {
    this.#authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const parsedData = loginSchema.parse({ email, password });
      const { accessToken, refreshToken } = await this.#authService.login(
        parsedData
      );

      res
        .header("Cache-Control", "no-store")
        .header("Pragma", "no-cache")
        .header("X-Content-Type-Options", "nosniff")
        .header("X-Frame-Options", "DENY")
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production" ? true : false,
          sameSite: "strict",
          maxAge: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        })
        .json({ accessToken });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
      }
    }
  };

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

  verifyEmail = async (
    req: Request & { params: { token: string } },
    res: Response
  ) => {
    try {
      const { token } = req.params;

      await this.#authService.verifyEmail(token);
      res.json({ message: "Email verified successfully" });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: error.message });
    }
  };

  refreshAccessToken = async (req: Request, res: Response) => {
    try {
      const refreshToken = refreshTokenSchema.parse(req.cookies.refreshToken);

      const hashedRefreshToken = hashToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      );

      if (!refreshToken) {
        res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ message: "Refresh token is required" });
      }

      const { accessToken } = await this.#authService.refreshAccessToken(
        hashedRefreshToken
      );

      res
        .header("Cache-Control", "no-store")
        .header("Pragma", "no-cache")
        .header("X-Content-Type-Options", "nosniff")
        .header("X-Frame-Options", "DENY")
        .json({ accessToken });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
      }
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const refreshToken = refreshTokenSchema.parse(req.cookies.refreshToken);

      if (refreshToken) {
        const hashedRefreshToken = hashToken(
          refreshToken,
          process.env.JWT_REFRESH_SECRET!
        );

        await this.#authService.logout(hashedRefreshToken);
      }

      res
        .clearCookie("refreshToken", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        })
        .status(StatusCodes.OK)
        .json({ message: "Logged out successfully" });
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
}
