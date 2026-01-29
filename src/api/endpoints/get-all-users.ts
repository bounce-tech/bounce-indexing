import { db } from "ponder:api";
import schema from "ponder:schema";

const getAllUsers = async () => {
  try {
    const users = await db
      .select({
        address: schema.user.address,
        tradeCount: schema.user.tradeCount,
        mintVolumeNominal: schema.user.mintVolumeNominal,
        redeemVolumeNominal: schema.user.redeemVolumeNominal,
        totalVolumeNominal: schema.user.totalVolumeNominal,
        mintVolumeNotional: schema.user.mintVolumeNotional,
        redeemVolumeNotional: schema.user.redeemVolumeNotional,
        totalVolumeNotional: schema.user.totalVolumeNotional,
        lastTradeTimestamp: schema.user.lastTradeTimestamp,
      })
      .from(schema.user);
    return users;
  } catch (error) {
    throw new Error("Failed to fetch all users");
  }
};

export default getAllUsers;
