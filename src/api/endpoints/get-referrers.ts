import { db } from "ponder:api";
import schema from "ponder:schema";
import { isNotNull } from "drizzle-orm";

const getReferrers = async () => {
  try {
    const referrers = await db
      .select({
        address: schema.user.address,
        referralCode: schema.user.referralCode,
        referred: schema.user.referredUserCount,
        earned: schema.user.referrerRebates,
      })
      .from(schema.user)
      .where(isNotNull(schema.user.referralCode));
    return referrers;
  } catch (error) {
    throw new Error("Failed to fetch referrers");
  }
};

export default getReferrers;
