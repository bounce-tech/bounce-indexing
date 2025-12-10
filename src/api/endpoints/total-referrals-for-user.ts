import { db } from "ponder:api";
import schema from "ponder:schema";
import { eq } from "drizzle-orm";
import { Address } from "viem";
import bigIntToNumber from "../utils/big-int-to-number";

const getTotalReferralsForUser = async (user: Address) => {
  const allReferrals = await db
    .select()
    .from(schema.referral)
    .where(eq(schema.referral.referrer, user));

  return allReferrals.length;
};

export default getTotalReferralsForUser;
