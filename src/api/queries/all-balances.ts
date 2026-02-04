import { Address } from "viem";
import { db } from "ponder:api";
import schema from "ponder:schema";


export interface Balance {
  totalBalance: bigint;
  purchaseCost: bigint;
  realizedProfit: bigint;
}

const getAllBalances = async (): Promise<Record<Address, Record<Address, Balance>>> => {
  try {
    const balancesData = await db
      .select({
        leveragedToken: schema.balance.leveragedToken,
        user: schema.balance.user,
        totalBalance: schema.balance.totalBalance,
        purchaseCost: schema.balance.purchaseCost,
        realizedProfit: schema.balance.realizedProfit,
      })
      .from(schema.balance)
    // From user, to leveraged token, to balance
    return balancesData.reduce((acc, balance) => {
      const userAddress = balance.user as Address;
      if (!acc[userAddress]) acc[userAddress] = {} as Record<Address, Balance>;
      acc[userAddress][balance.leveragedToken as Address] = {
        totalBalance: balance.totalBalance,
        purchaseCost: balance.purchaseCost,
        realizedProfit: balance.realizedProfit,
      };
      return acc;
    }, {} as Record<Address, Record<Address, Balance>>);
  } catch (error) {
    throw new Error("Failed to fetch all balances");
  }
};

export default getAllBalances;
