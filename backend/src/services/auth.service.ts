import jwt from "jsonwebtoken";
import { EmailService } from "./email.service";
import { prisma } from "lib/prisma";
import {
  BCRYPT_SALT_ROUNDS,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants";
import bcrypt from "bcrypt";
import type { LoginSchema, RegisterSchema } from "schemas/types";
import { TokenService } from "./token.service";

export class AuthService {
  #prisma = prisma;
  #emailService: EmailService;
  #tokenService: TokenService;

  constructor() {
    this.#emailService = new EmailService();
    this.#tokenService = new TokenService();
  }

  login = async ({ email, password }: LoginSchema) => {
    try {
      const user = await this.#prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new Error("E-mail is not registered");
      }

      if (!user.isEmailVerified) {
        throw new Error("Please verify your email first");
      }

      const validPassword = await bcrypt.compare(password, user.password);

      if (!validPassword) {
        throw new Error("Invalid password");
      }

      const accessToken = this.#tokenService.generateAccessToken({
        id: `${user.id}`,
        email: user.email,
      });

      const refreshToken = this.#tokenService.generateRefreshToken({
        id: `${user.id}`,
      });

      await this.#tokenService.saveRefreshToken(refreshToken, user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };

  async register({ name, email, password }: RegisterSchema) {
    try {
      const isUserAlreadyRegistered = await this.#prisma.user.findUnique({
        where: { email },
      });

      if (isUserAlreadyRegistered) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      const verificationToken = jwt.sign(
        { email },
        process.env.JWT_ACCESS_SECRET!,
        {
          expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        }
      );

      await this.#prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isEmailVerified: false,
        },
      });

      await this.#emailService.sendVerificationEmail(email, verificationToken);
      console.log("Verification email sent to:", email, verificationToken);
    } catch (error) {
      throw new Error(`Registration failed => ${error}`);
    }
  }

  async verifyEmail(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as {
        email: string;
      };

      await this.#prisma.user.update({
        where: { email: decoded.email },
        data: { isEmailVerified: true },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to verify email => ${error}`);
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const storedToken = await this.#prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });

      if (!storedToken) {
        throw new Error("Invalid refresh token");
      }

      if (storedToken.expiresAt < new Date()) {
        await this.#prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });

        throw new Error("Refresh token expired");
      }

      const accessToken = this.#tokenService.generateAccessToken({
        id: `${storedToken.userId}`,
        email: storedToken.user.email,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new Error(`Failed to refresh access token => ${error}`);
    }
  }

  async logout(refreshToken: string) {
    try {
      await this.#prisma.refreshToken.delete({
        where: { token: refreshToken },
      });
    } catch (error) {
      throw new Error(`Failed to logout => ${error}`);
    }
  }
}
