import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCurrencyHistory = async (
  cryptocurrency: string,
  convertCurrency: string
): Promise<{ date: Date; price: number }[]> => {
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${cryptocurrency}&tsym=${convertCurrency}&limit=2000&api_key=${process.env.CRYPTOCOMPARE_API_KEY}`
    );
    const data = await response.json();
    return data.Data.Data.map((currency: any) => {
      return {
        date: new Date(currency.time * 1000),
        price: currency.close,
      };
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};

const populateDb = async (cryptocurrency: string, convertCurrency: string) => {
  try {
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
      const currencyHistory = await prisma.currencyHistory.upsert({
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
    console.error(err);
  }
};

populateDb("ETH", "EUR");
