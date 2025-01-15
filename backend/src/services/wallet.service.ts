import { prisma } from "lib/prisma";

export class WalletService {
  #prisma = prisma;

  delete = async (walletId: number) => {
    try {
      await this.#prisma.walletHistory.deleteMany({
        where: {
          walletId: walletId,
          wallet: {
            userId: 1, // todo: get user id with auth
          },
        },
      });
      await this.#prisma.wallet.delete({
        where: {
          id: walletId,
          userId: 1, // todo: get user id with auth
        },
      });
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };

  // todo: typing
  create = async (address, title) => {
    try {
      const wallet = await prisma.wallet.create({
        data: {
          userId: 1, // todo: get user id with auth
          address: address,
          title: title,
        },
      });

      return wallet;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };

  all = async () => {
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
