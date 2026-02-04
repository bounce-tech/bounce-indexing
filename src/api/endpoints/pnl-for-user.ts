import { Address } from "viem";
import getTradesForUser from "../queries/trades-for-user";
import getTransfersForUser from "../queries/transfers-for-user";
import convertToActions from "../utils/convert-to-actions";
import { convertDecimals, mul } from "../utils/scaled-number";
import getCostAndRealized from "../utils/get-cost-and-realized";
import bigIntToNumber from "../utils/big-int-to-number";
import getBalancesForUser from "../queries/balances-for-user";
import getExchangeRates from "../queries/exchange-rates";

interface LeveragedTokenPnl {
  realized: number;
  unrealized: number;
  unrealizedPercent: number;
}

interface UserPnl {
  totalRealized: number;
  totalUnrealized: number;
  leveragedTokens: Record<Address, LeveragedTokenPnl>;
}

const getPnlForUser = async (user: Address) => {
  try {
    const [trades, transfers, balances, exchangeRates] = await Promise.all([
      getTradesForUser(user),
      getTransfersForUser(user),
      getBalancesForUser(user),
      getExchangeRates(),
    ]);
    const tradeLts = trades.map((trade) => trade.leveragedToken);
    const transferLts = transfers.map((transfer) => transfer.leveragedToken);
    const uniqueLts = [...new Set([...tradeLts, ...transferLts])];
    const leveragedTokens: Record<Address, LeveragedTokenPnl> = {};
    let totalRealized = 0;
    let totalUnrealized = 0;
    for (const lt of uniqueLts) {
      const ltBalance = balances.find((b) => b.leveragedToken === lt)?.balance ?? 0n;
      const exchangeRate = exchangeRates.find((e) => e.leveragedToken === lt)?.exchangeRate;
      if (!exchangeRate) throw new Error(`Exchange rate for leveraged token ${lt} not found`);
      const ltTrades = trades.filter((t) => t.leveragedToken === lt);
      const ltTransfers = transfers.filter((t) => t.leveragedToken === lt);
      const actions = convertToActions(ltTrades, ltTransfers);
      const { cost, realized } = getCostAndRealized(actions);
      const realizedNumber = bigIntToNumber(realized, 6);
      const costNumber = bigIntToNumber(cost, 6);
      const costScaled = convertDecimals(cost, 6, 18);
      const currentValue = mul(ltBalance, exchangeRate);
      const unrealized = bigIntToNumber(currentValue - costScaled, 18);
      const unrealizedPercent = costNumber === 0 ? 0 : unrealized / costNumber;
      leveragedTokens[lt] = {
        realized: realizedNumber,
        unrealized,
        unrealizedPercent: Number(unrealizedPercent.toFixed(6)),
      };
      totalRealized += realizedNumber;
      totalUnrealized += unrealized;
    }
    const userPnl: UserPnl = {
      totalRealized,
      totalUnrealized,
      leveragedTokens,
    };
    return userPnl;
  } catch (error) {
    throw new Error("Failed to fetch profit and loss data");
  }
};

export default getPnlForUser;
