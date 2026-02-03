import { db } from "ponder:api";
import schema from "ponder:schema";

export interface LeveragedTokenSummary {
  address: string;
  marketId: number;
  targetLeverage: bigint;
  isLong: boolean;
  symbol: string;
  name: string;
  decimals: number;
  asset: string;
  exchangeRate: bigint;
}

export const leveragedTokenSelect = {
  address: schema.leveragedToken.address,
  marketId: schema.leveragedToken.marketId,
  targetLeverage: schema.leveragedToken.targetLeverage,
  isLong: schema.leveragedToken.isLong,
  symbol: schema.leveragedToken.symbol,
  name: schema.leveragedToken.name,
  decimals: schema.leveragedToken.decimals,
  asset: schema.leveragedToken.asset,
  exchangeRate: schema.leveragedToken.exchangeRate,
};

const getAllLeveragedTokens = async (): Promise<LeveragedTokenSummary[]> => {
  try {
    const leveragedTokens = await db
      .select(leveragedTokenSelect)
      .from(schema.leveragedToken);

    return leveragedTokens;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch all leveraged tokens");
  }
};

export default getAllLeveragedTokens;
