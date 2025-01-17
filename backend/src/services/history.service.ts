import { prisma } from "lib/prisma";
import type { Filters } from "schemas/types";

export class HistoryService {
  #prisma = prisma;

  get = async (walletId: number, startDate: string) => {
    try {
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
