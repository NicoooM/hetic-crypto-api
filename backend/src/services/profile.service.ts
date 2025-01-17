import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "lib/prisma";
import {
  BCRYPT_SALT_ROUNDS,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
} from "../constants";
import type { PasswordSchema, ProfileSchema } from "schemas/types";
import { EmailService } from "./email.service";

export class ProfileService {
  #bcrypt = bcrypt;
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

  resetPassword = async ({
    oldPassword,
    newPassword,
    id,
  }: PasswordSchema & { id: number }) => {
    try {
      const oldHashedPassword = await this.#bcrypt.hash(
        oldPassword,
        BCRYPT_SALT_ROUNDS
      );

      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
        select: {
          password: true,
        },
      });

      if (user?.password === oldHashedPassword) {
        throw new Error("Old password is incorrect");
      }

      const newHashedPassword = await this.#bcrypt.hash(
        newPassword,
        BCRYPT_SALT_ROUNDS
      );

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          password: newHashedPassword,
        },
      });
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
