import schema from "ponder:schema";
import { Address } from "viem";

export async function ensureUser(
    db: any,
    address: Address
): Promise<void> {
    await db
        .insert(schema.user)
        .values({ address: address })
        .onConflictDoNothing();
}
