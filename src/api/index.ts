import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { sql } from "drizzle-orm";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

app.get("/stats", async (c) => {
  const tradeResult = await db
    .select({
      marginVolume: sql<string>`sum(${schema.trade.baseAssetAmount}) / 1000000`,
      notionalVolume: sql<string>`sum(${schema.trade.baseAssetAmount} * ${schema.leveragedToken.targetLeverage}) / 1000000000000000000000000`,
      uniqueUsers: sql<number>`count(distinct ${schema.trade.recipient})`,
    })
    .from(schema.trade)
    .leftJoin(
      schema.leveragedToken,
      sql`${schema.trade.leveragedToken} = ${schema.leveragedToken.address}`
    );

  const leveragedTokenResult = await db
    .select({
      supportedAssets: sql<number>`count(distinct ${schema.leveragedToken.marketId})`,
      leveragedTokens: sql<number>`count(*)`,
    })
    .from(schema.leveragedToken);

  const marginVolume = Number(tradeResult[0]?.marginVolume || 0);
  const notionalVolume = Number(tradeResult[0]?.notionalVolume || 0);
  const averageLeverage = notionalVolume / marginVolume;
  const uniqueAssets = leveragedTokenResult[0]?.supportedAssets || 0;
  const leveragedTokens = leveragedTokenResult[0]?.leveragedTokens || 0;
  const uniqueUsers = tradeResult[0]?.uniqueUsers || 0;

  return c.json({
    marginVolume: marginVolume,
    notionalVolume: notionalVolume,
    averageLeverage: averageLeverage,
    supportedAssets: uniqueAssets,
    leveragedTokens: leveragedTokens,
    uniqueUsers: uniqueUsers,
  });
});

export default app;
