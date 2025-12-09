import { Trade, TradeType } from "../queries/trades-for-user";
import { Transfer, TransferType } from "../queries/transfers-for-user";
import bigIntToNumber from "./big-int-to-number";

export type ActionType = TradeType | TransferType;

export interface Action {
  type: ActionType;
  baseAmount: number;
  leveragedTokenAmount: number;
  time: Date;
}

const convertToActions = (trades: Trade[], transfers: Transfer[]): Action[] => {
  const actions: Action[] = [];
  for (const trade of trades) {
    actions.push({
      type: trade.type,
      baseAmount: bigIntToNumber(trade.baseAssetAmount, 6),
      leveragedTokenAmount: bigIntToNumber(trade.leveragedTokenAmount, 18),
      time: trade.timestamp,
    });
  }
  for (const transfer of transfers) {
    actions.push({
      type: transfer.type,
      baseAmount: 0,
      leveragedTokenAmount: bigIntToNumber(transfer.amount, 18),
      time: transfer.timestamp,
    });
  }

  actions.sort((a, b) => a.time.getTime() - b.time.getTime());

  return actions;
};

export default convertToActions;
