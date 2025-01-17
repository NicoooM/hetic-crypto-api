import {
  BCRYPT_SALT_ROUNDS,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants";
import jwt from "jsonwebtoken";
import { prisma } from "lib/prisma";
import crypto from "crypto";

export class TokenService {
  #prisma = prisma;
  #crypto = crypto;

  constructor() {}

  generateAccessToken({ id, email }: { id: string; email: string }) {
    const accessToken = jwt.sign(
      { id, email },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME }
    );

    return accessToken;
  }

  generateRefreshToken({ id }: { id: string }) {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  async saveRefreshToken(token: string, userId: number) {
    const hashedRefreshToken = this.#crypto
      .createHmac("sha256", process.env.JWT_REFRESH_SECRET!)
      .update(token)
      .digest("hex");

    return this.#prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId,
        expiresAt: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      },
    });
  }
}
