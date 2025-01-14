import jwt from "jsonwebtoken";
import type { PrismaClient } from "@prisma/client";
import { EmailService } from "./email.service";
import { prisma } from "lib/prisma";
import { StatusCodes } from "http-status-codes";
import { TOKEN_EXPIRATION_TIME } from "../constants";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import type { RegisterSchema } from "schemas/types";

export class AuthService {
  #prisma = prisma;
  #emailService: EmailService;
  //   #tokenService: TokenService;

  constructor() {
    this.#emailService = new EmailService();
    // this.#tokenService = new TokenService();
  }

  async register({ name, email, password }: RegisterSchema) {
    try {
      const isUserAlreadyRegistered = await this.#prisma.user.findUnique({
        where: { email },
      });

      if (isUserAlreadyRegistered) {
        throw new Error("Email already registered");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = jwt.sign(
        { email },
        process.env.JWT_ACCESS_SECRET!,
        {
          expiresIn: TOKEN_EXPIRATION_TIME,
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
}
