import { prisma } from "lib/prisma";

export class PortfolioService {
  #prisma = prisma;
  get = async (walletId: number) => {
    try {
      // Get wallet address
      const wallet = await this.#prisma.wallet.findUnique({
        where: {
          id: walletId,
        },
        select: {
          address: true,
        },
      });
      const walletAddress = wallet?.address;

      // Get last wallet value history
      const walletHistory = await prisma.walletHistory.findFirst({
        where: {
          walletId: walletId,
        },
        select: {
          value: true,
        },
      });
      const lastWalletHistoryValue = walletHistory?.value;

      // Allocation
      const allocation = 1;

      // Price
      const price = await fetch(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR"
      );
      const priceResponse = await price.json();
      const priceData = priceResponse.EUR;

      // Daily price
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const timestamp = Math.floor(yesterday.getTime() / 1000);
      const dailyPriceFetch = await fetch(
        `https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=EUR&ts=${timestamp}`
      );
      const dailyPriceResponse = await dailyPriceFetch.json();
      const dailyPriceData = dailyPriceResponse.ETH.EUR;
      const dailyPrice = ((priceData - dailyPriceData) / dailyPriceData) * 100;

      // Value
      const valueFetch = await fetch(
        `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${process.env.ETHERSCAN_API_KEY}`
      );
      const valueResponse = await valueFetch.json();
      const valueData = valueResponse.result;
      const value = (valueData / 10 ** 18) * priceData;

      // Daily value
      let dailyValue = 0;
      if (lastWalletHistoryValue) {
        dailyValue = value - lastWalletHistoryValue;
      }

      return { allocation, priceData, dailyPrice, value, dailyValue };
    } catch (error) {
      throw new Error(`Login failed => ${error}`);
    }
  };
}
