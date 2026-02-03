import { db } from "ponder:api";
import schema from "ponder:schema";
import { eq } from "drizzle-orm";
import { Address } from "viem";
import { LeveragedTokenSummary, leveragedTokenSelect } from "./get-all-leveraged-tokens";

const getLeveragedToken = async (
  leveragedTokenAddress: Address
): Promise<LeveragedTokenSummary | null> => {
  try {
    const result = await db
      .select(leveragedTokenSelect)
      .from(schema.leveragedToken)
      .where(eq(schema.leveragedToken.address, leveragedTokenAddress))
      .limit(1);

    return result[0] ?? null;
  } catch (error) {
    throw new Error("Failed to fetch leveraged token");
  }
};

export default getLeveragedToken;
