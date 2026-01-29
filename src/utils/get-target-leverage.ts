import schema from "ponder:schema";
import { Address } from "viem";

export async function getTargetLeverage(
    db: any,
    client: any,
    contracts: any,
    leveragedTokenAddress: Address
): Promise<bigint> {
    // Try to get from database first
    const leveragedToken = await db.find(schema.leveragedToken, {
        address: leveragedTokenAddress,
    });

    if (leveragedToken) return leveragedToken.targetLeverage;

    // Read from contract if not in database
    return await client.readContract({
        abi: contracts.LeveragedToken.abi,
        address: leveragedTokenAddress,
        functionName: "targetLeverage",
    });
}
