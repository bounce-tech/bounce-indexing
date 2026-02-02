import schema from "ponder:schema";
import { Address } from "viem";

export async function ensureBalance(
    db: any,
    user: Address,
    leveragedToken: Address
): Promise<void> {
    await db
        .insert(schema.balance)
        .values({ user: user, leveragedToken: leveragedToken })
        .onConflictDoNothing();
}
