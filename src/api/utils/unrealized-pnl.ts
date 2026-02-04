import { Address } from "viem";
import { convertDecimals, mul } from "./scaled-number";
import { Balance } from "../queries/balances-for-user";
import bigIntToNumber from "./big-int-to-number";


const getUnrealizedPnl = (leveragedTokens: Address[], balances: Record<Address, Balance>, exchangeRates: Record<Address, bigint>): number => {
  try {
    let totalUnrealized = 0n;
    for (const lt of leveragedTokens) {
      const balance = balances[lt];
      if (!balance) throw new Error(`Balance for leveraged token ${lt} not found`);
      const exchangeRate = exchangeRates[lt];
      if (!exchangeRate) throw new Error(`Exchange rate for leveraged token ${lt} not found`);
      const costScaled = convertDecimals(balance.purchaseCost, 6, 18);
      const currentValue = mul(balance.totalBalance, exchangeRate);
      totalUnrealized += currentValue - costScaled;
    }
    return bigIntToNumber(totalUnrealized, 18);
  } catch (error) {
    throw new Error("Failed to fetch unrealized PNL");
  }
};

export default getUnrealizedPnl;
