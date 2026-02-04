import { Address } from "viem";
import { db } from "ponder:api";
import schema from "ponder:schema";



const getExchangeRates = async (): Promise<Record<Address, bigint>> => {
  try {
    const exchangeRateData = await db
      .select({
        leveragedToken: schema.leveragedToken.address,
        exchangeRate: schema.leveragedToken.exchangeRate,
      })
      .from(schema.leveragedToken);
    return exchangeRateData.reduce((acc, exchangeRate) => {
      acc[exchangeRate.leveragedToken as Address] = exchangeRate.exchangeRate;
      return acc;
    }, {} as Record<Address, bigint>);
  } catch (error) {
    throw new Error("Failed to fetch exchange rates");
  }
};

export default getExchangeRates;
