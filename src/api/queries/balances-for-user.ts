import { Address } from "viem";
import { db } from "ponder:api";
import schema from "ponder:schema";
import { eq } from "drizzle-orm";


export interface Balance {
  leveragedToken: Address;
  totalBalance: bigint;
  purchaseCost: bigint;
  realizedProfit: bigint;
}

const getBalancesForUser = async (user: Address): Promise<Balance[]> => {
  try {
    const balancesData = await db
      .select({
        leveragedToken: schema.balance.leveragedToken,
        totalBalance: schema.balance.totalBalance,
        purchaseCost: schema.balance.purchaseCost,
        realizedProfit: schema.balance.realizedProfit,
      })
      .from(schema.balance)
      .where(
        eq(schema.balance.user, user as Address)
      );
    return balancesData.map((balance) => ({
      leveragedToken: balance.leveragedToken as Address,
      totalBalance: balance.totalBalance,
      purchaseCost: balance.purchaseCost,
      realizedProfit: balance.realizedProfit,
    }));
  } catch (error) {
    throw new Error("Failed to fetch balances for user");
  }
};

export default getBalancesForUser;
