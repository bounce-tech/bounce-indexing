import { db } from "ponder:api";
import { eq } from "drizzle-orm";
import { Address } from "viem";
import schema from "ponder:schema";

const getUsersTrades = async (user: Address) => {
  const tradesData = await db
    .select({
      timestamp: schema.trade.timestamp,
      isBuy: schema.trade.isBuy,
      baseAssetAmount: schema.trade.baseAssetAmount,
      leveragedTokenAmount: schema.trade.leveragedTokenAmount,
      leveragedToken: schema.trade.leveragedToken,
    })
    .from(schema.trade)
    .where(eq(schema.trade.recipient, user as Address));
  return tradesData;
};

export default getUsersTrades;
