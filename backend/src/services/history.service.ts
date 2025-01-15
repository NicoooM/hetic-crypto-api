import { prisma } from "lib/prisma";

export class HistoryService {
  #prisma = prisma;

  // todo: typing
  get = async (walletId: number, startDate) => {
    try {
      // todo: typing
      const filters: Filters = {
        walletId: walletId,
        wallet: {
          user: {
            id: 1, // todo: get user id with auth
          },
        },
      };

      if (startDate) {
        filters.date = { gte: new Date(startDate as string) };
      }

      const history = await this.#prisma.walletHistory.findMany({
        where: filters,
      });

      return history;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
