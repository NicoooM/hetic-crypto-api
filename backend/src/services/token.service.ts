import { JWT_REFRESH_TOKEN_EXPIRATION_TIME } from "../constants";
import jwt from "jsonwebtoken";
import { prisma } from "lib/prisma";

export class TokenService {
  #prisma = prisma;

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
    return this.#prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt: new Date(Date.now() + JWT_REFRESH_TOKEN_EXPIRATION_TIME),
      },
    });
  }
}
