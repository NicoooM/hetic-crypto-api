import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface CurrencyDataPoint {
  date: Date;
  price: number;
}

interface CryptoCompareCurrency {
  time: number;
  close: number;
  volumefrom: number;
}

interface CryptoCompareResponse {
  Response: string;
  Data: {
    Data: CryptoCompareCurrency[];
  };
}

const cleanCurrencyHistory = async () => {
  try {
    console.log("Cleaning currency history...");
    await prisma.currencyHistory.deleteMany({});
  } catch (err) {
    console.error(err);
  }
};

const getCurrencyHistory = async (
  cryptocurrency: string,
  convertCurrency: string
): Promise<CurrencyDataPoint[]> => {
  const allData: CurrencyDataPoint[] = [];
  let toTimestamp = null;
  const limit = 2000; // Maximum limit

  try {
    while (true) {
      console.log(
        toTimestamp
          ? `Fetching data from ${new Date(toTimestamp * 1000)}...`
          : "Fetching base data..."
      );

      const url: string = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=${convertCurrency}&limit=${limit}${
        toTimestamp ? `&toTs=${toTimestamp}` : ""
      }&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`;
      const response = await fetch(url);
      const data: CryptoCompareResponse = await response.json();

      if (data.Response !== "Success" || !data.Data.Data.length) break;

      const chunkData = data.Data.Data.reduce(
        (
          acc: { date: Date; price: number }[],
          currency: CryptoCompareCurrency
        ) => {
          if (currency.volumefrom !== 0) {
            acc.push({
              date: new Date(currency.time * 1000),
              price: currency.close,
            });
          }
          return acc;
        },
        []
      );

      allData.push(...chunkData);

      if (
        data.Data.Data.some(
          (currency: CryptoCompareCurrency) => currency.volumefrom === 0
        )
      ) {
        break;
      }

      toTimestamp = chunkData[0].date.getTime() / 1000;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return allData;
};

const populateDb = async (cryptocurrency: string, convertCurrency: string) => {
  try {
    console.log(`Populating database with ${cryptocurrency} data...`);
    const currencyHistory = await getCurrencyHistory(
      cryptocurrency,
      convertCurrency
    );

    const cryptocurrencyInDb = await prisma.currency.upsert({
      where: { symbol: cryptocurrency },
      update: {},
      create: {
        symbol: cryptocurrency,
      },
    });

    for (const currency of currencyHistory) {
      if (!currency || !currency.date || !currency.price) {
        console.warn("Skipping invalid currency entry:", currency);
        continue;
      }

      await prisma.currencyHistory.upsert({
        where: {
          date_currencyId: {
            date: currency.date,
            currencyId: cryptocurrencyInDb.id,
          },
        },
        update: {
          price: currency.price,
        },
        create: {
          date: currency.date,
          price: currency.price,
          currency: {
            connect: {
              id: cryptocurrencyInDb.id,
            },
          },
        },
      });
    }
  } catch (err) {
    console.error("Error populating database:", err);
  }
};

cleanCurrencyHistory();
populateDb("ETH", "EUR");
