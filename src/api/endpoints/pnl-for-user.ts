import { Address } from "viem";
import { convertDecimals, mul } from "../utils/scaled-number";
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
    const [balances, exchangeRates] = await Promise.all([
      getBalancesForUser(user),
      getExchangeRates(),
    ]);
    const balanceLts = balances.map((b) => b.leveragedToken);
    const uniqueLts = [...new Set(balanceLts)];
    const leveragedTokens: Record<Address, LeveragedTokenPnl> = {};
    let totalRealized = 0;
    let totalUnrealized = 0;
    for (const lt of uniqueLts) {
      const balance = balances.find((b) => b.leveragedToken === lt);
      if (!balance) throw new Error(`Balance for leveraged token ${lt} not found`);
      const exchangeRate = exchangeRates.find((e) => e.leveragedToken === lt)?.exchangeRate;
      if (!exchangeRate) throw new Error(`Exchange rate for leveraged token ${lt} not found`);
      const realizedNumber = bigIntToNumber(balance.realizedProfit, 6);
      const costNumber = bigIntToNumber(balance.purchaseCost, 6);
      const costScaled = convertDecimals(balance.purchaseCost, 6, 18);
      const currentValue = mul(balance.totalBalance, exchangeRate);
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
