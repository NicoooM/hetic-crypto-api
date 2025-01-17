import bcrypt from "bcrypt";
import { prisma } from "lib/prisma";
import type { RegisterSchema } from "schemas/types";

export class ProfileService {
  #prisma = prisma;

  get = async () => {
    try {
      const profile = await this.#prisma.user.findUnique({
        where: {
          id: 1, // todo: get user id with auth
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

  edit = async ({ name, email, password }: RegisterSchema) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.update({
        where: {
          id: 1, // todo: get user id with auth
        },
        data: {
          name: name || null,
          email: email, // todo: need to re-check if new email
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
