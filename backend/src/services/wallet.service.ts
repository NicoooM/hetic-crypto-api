import { prisma } from "lib/prisma";
import type { WalletSchema } from "schemas/types";
import { createWalletHistory } from "utils/etherscan";

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

  create = async ({ address, title }: WalletSchema) => {
    try {
      const wallet = await prisma.wallet.create({
        data: {
          userId: 1, // todo: get user id with auth
          address: address,
          title: title,
        },
      });

      const walletHistory = await createWalletHistory(address);

      const currency = await prisma.currency.findUnique({
        where: {
          symbol: "ETH",
        },
      });

      if (!currency) {
        throw new Error("ETH currency not found");
      }

      const cryptoHistory = await prisma.currencyHistory.findMany({
        where: {
          currencyId: currency.id,
        },
      });

      const ethPriceMap = new Map();
      cryptoHistory.forEach((entry) => {
        const dateKey = entry.date.toISOString().split("T")[0];
        ethPriceMap.set(dateKey, entry.price);
      });

      const enrichedWalletHistory = walletHistory.map((entry) => {
        const dateKey = entry.date.toISOString().split("T")[0];
        const ethPrice = ethPriceMap.get(dateKey) || 0;

        const valueInCurrency = entry.value * ethPrice;

        return {
          ...entry,
          valueInCurrency,
        };
      });

      await prisma.walletHistory.createMany({
        data: enrichedWalletHistory.map((entry) => ({
          walletId: wallet.id,
          date: entry.date,
          value: entry.valueInCurrency,
          quantity: entry.value,
          currencyId: currency.id,
        })),
      });

      return wallet;
    } catch (error) {
      throw new Error(`Wallet creation failed => ${error}`);
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
