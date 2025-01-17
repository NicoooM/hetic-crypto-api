import jwt from "jsonwebtoken";
import { prisma } from "lib/prisma";
import { JWT_REFRESH_TOKEN_EXPIRATION_TIME } from "../constants";
import type { ProfileSchema } from "schemas/types";
import { EmailService } from "./email.service";

export class ProfileService {
  #prisma = prisma;
  #emailService: EmailService;

  constructor() {
    this.#emailService = new EmailService();
  }

  get = async (id: number) => {
    try {
      const profile = await this.#prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          name: true,
          email: true,
        },
      });

      return profile;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };

  edit = async ({ name, email, id }: ProfileSchema & { id: number }) => {
    try {
      const userData = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          email: true,
        },
      });
      const isSameEmail = userData?.email === email;

      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name || null,
          email: email,
          isEmailVerified: isSameEmail,
        },
      });

      const verificationToken = jwt.sign(
        { email },
        process.env.JWT_ACCESS_SECRET!,
        {
          expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        }
      );
      !isSameEmail &&
        (await this.#emailService.sendVerificationEmail(
          email,
          verificationToken
        ));
      return user;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
