import { db } from "ponder:api";
import schema from "ponder:schema";
import { eq } from "drizzle-orm";
import { Address } from "viem";
import bigIntToNumber from "../utils/big-int-to-number";

const getTotalRebatesForUser = async (user: Address) => {
  const totalRebates = await db
    .select({
      rebateAmount: schema.rebate.rebate,
    })
    .from(schema.rebate)
    .where(eq(schema.rebate.sender, user));
  const total = totalRebates.reduce(
    (acc, rebate) => acc + bigIntToNumber(rebate.rebateAmount, 6),
    0
  );
  return total;
};

export default getTotalRebatesForUser;
