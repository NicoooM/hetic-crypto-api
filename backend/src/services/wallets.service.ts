import { prisma } from "lib/prisma";

export class WalletsService {
  #prisma = prisma;

  get = async () => {
    try {
      const wallets = await this.#prisma.wallet.findMany({
        where: {
          userId: 1, // todo: get user id with auth
        },
      });
      return wallets;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
