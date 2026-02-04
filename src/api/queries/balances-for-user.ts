import { Address } from "viem";
import { db } from "ponder:api";
import schema from "ponder:schema";
import { eq } from "drizzle-orm";


export interface Balance {
  totalBalance: bigint;
  purchaseCost: bigint;
  realizedProfit: bigint;
}

const getBalancesForUser = async (user: Address): Promise<Record<Address, Balance>> => {
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
    return balancesData.reduce((acc, balance) => {
      acc[balance.leveragedToken as Address] = {
        totalBalance: balance.totalBalance,
        purchaseCost: balance.purchaseCost,
        realizedProfit: balance.realizedProfit,
      };
      return acc;
    }, {} as Record<Address, Balance>);
  } catch (error) {
    throw new Error("Failed to fetch balances for user");
  }
};

export default getBalancesForUser;
