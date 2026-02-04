import schema from "ponder:schema";
import { Address } from "viem";

export async function getTargetLeverage(
    db: any,
    leveragedTokenAddress: Address
): Promise<bigint> {
    const leveragedToken = await db.find(schema.leveragedToken, {
        address: leveragedTokenAddress,
    });
    if (!leveragedToken) throw new Error("Leveraged token not found");
    return leveragedToken.targetLeverage;
}
