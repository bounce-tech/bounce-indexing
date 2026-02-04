import { db } from "ponder:api";
import { eq, and, desc, sql } from "drizzle-orm";
import { Address } from "viem";
import schema from "ponder:schema";
import { PaginatedResponse } from "../utils/cursor-pagination";
import { applyCursorFilter, calculatePageInfo } from "../utils/pagination-helpers";
import bigIntToNumber from "../utils/big-int-to-number";

export interface UserTrade {
  id: string;
  txHash: string;
  timestamp: bigint;
  isBuy: boolean;
  baseAssetAmount: bigint;
  leveragedTokenAmount: bigint;
  leveragedToken: Address;
  targetLeverage: number;
  isLong: boolean;
  asset: string;
  profitAmount: number | null;
  profitPercent: number | null;
}

const getUsersTrades = async (
  user: Address,
  asset?: string,
  leveragedTokenAddress?: Address,
  after?: string,
  before?: string,
  limit: number = 100
): Promise<PaginatedResponse<UserTrade>> => {
  try {
    // Build base where conditions
    const whereConditions: any[] = [eq(schema.trade.recipient, user as Address)];
    if (asset && leveragedTokenAddress) {
      whereConditions.push(eq(schema.leveragedToken.asset, asset));
      whereConditions.push(eq(schema.leveragedToken.address, leveragedTokenAddress));
    } else if (asset) {
      whereConditions.push(eq(schema.leveragedToken.asset, asset));
    } else if (leveragedTokenAddress) {
      whereConditions.push(eq(schema.leveragedToken.address, leveragedTokenAddress));
    }
    const baseWhere = whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0];

    // Apply cursor-based filtering
    const where = applyCursorFilter(
      baseWhere,
      after,
      before,
      schema.trade.timestamp,
      schema.trade.id
    );

    // Query with limit + 1 to check if there's a next page
    const tradesData = await db
      .select({
        id: schema.trade.id,
        txHash: schema.trade.txHash,
        timestamp: schema.trade.timestamp,
        isBuy: schema.trade.isBuy,
        baseAssetAmount: schema.trade.baseAssetAmount,
        leveragedTokenAmount: schema.trade.leveragedTokenAmount,
        leveragedToken: schema.trade.leveragedToken,
        targetLeverage: schema.leveragedToken.targetLeverage,
        isLong: schema.leveragedToken.isLong,
        asset: schema.leveragedToken.asset,
        profitAmount: schema.trade.profitAmount,
        profitPercent: schema.trade.profitPercent,
      })
      .from(schema.trade)
      .innerJoin(
        schema.leveragedToken,
        eq(schema.trade.leveragedToken, schema.leveragedToken.address)
      )
      .where(where)
      .orderBy(desc(schema.trade.timestamp), schema.trade.id)
      .limit(limit + 1);

    const hasMore = tradesData.length > limit;
    const items = hasMore ? tradesData.slice(0, limit) : tradesData;
    const pageInfo = calculatePageInfo(
      items,
      hasMore,
      after,
      before,
      (item) => item.timestamp,
      (item) => item.id
    );


    // Get total count (always included) - use base where conditions without cursor filtering
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(schema.trade)
      .innerJoin(
        schema.leveragedToken,
        eq(schema.trade.leveragedToken, schema.leveragedToken.address)
      )
      .where(baseWhere);
    const totalCount = Number(countResult[0]?.count || 0);

    return {
      items: items.map((item) => ({
        ...item,
        targetLeverage: bigIntToNumber(item.targetLeverage, 18),
        profitAmount: item.profitAmount ? bigIntToNumber(item.profitAmount, 6) : null,
        profitPercent: item.profitPercent ? bigIntToNumber(item.profitPercent, 18) : null,
      })),
      pageInfo,
      totalCount,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch user trades");
  }
};

export default getUsersTrades;
