import { prisma } from "lib/prisma";
import type { FiltersSchema } from "schemas/types";

export class HistoryService {
  #prisma = prisma;

  get = async (filters: FiltersSchema) => {
    try {
      const history = await this.#prisma.walletHistory.findMany({
        where: filters,
      });

      return history;
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
