import { TradeType } from "../queries/trades-for-user";
import { TransferType } from "../queries/transfers-for-user";
import { Action } from "./convert-to-actions";
import { div, mul, SCALE } from "./scaled-number";

const getCostAndRealized = (
  actions: Action[]
): { cost: bigint; realized: bigint } => {
  let totalCost = BigInt(0);
  let totalAmount = BigInt(0);
  let averageCost = BigInt(0);
  let realized = BigInt(0);

  for (const action of actions) {
    const { leveragedTokenAmount, baseAmount, type } = action;
    if (action.type === TransferType.TRANSFER_OUT) {
      if (totalAmount <= 0) {
        // Nothing to transfer out, skip to next trade to avoid division by zero
        continue;
      }
      const percentageTransferred = div(leveragedTokenAmount, totalAmount);
      totalCost = mul(totalCost, SCALE - percentageTransferred);
      totalAmount = mul(totalAmount, SCALE - percentageTransferred);
      continue;
    }
    if (action.type === TradeType.MINT) {
      // When minting, add to position and update average cost
      const tradeCost = baseAmount;
      const tradeAmount = leveragedTokenAmount;

      totalCost += tradeCost;
      totalAmount += tradeAmount;
      averageCost = totalAmount > 0n ? div(totalCost, totalAmount) : 0n;
      continue;
    }
    if (action.type === TransferType.TRANSFER_IN) {
      // Process transfer in as a mint
      const tradeCost = baseAmount;
      const tradeAmount = leveragedTokenAmount;

      totalCost += tradeCost;
      totalAmount += tradeAmount;
      averageCost = totalAmount > 0n ? div(totalCost, totalAmount) : 0n;
      continue;
    }
    if (action.type === TradeType.REDEEM) {
      // When redeeming, reduce position but keep same average cost
      const tradeAmount = leveragedTokenAmount;
      if (tradeAmount === 0n) continue;
      totalAmount -= tradeAmount;
      // Update total cost based on remaining position
      totalCost = mul(totalAmount, averageCost);

      const currentPrice = div(baseAmount, tradeAmount);
      const priceDifference = currentPrice - averageCost;
      realized += mul(priceDifference, tradeAmount);
    }
  }

  // Return the cost value of the current position
  return { cost: mul(totalAmount, averageCost), realized };
};

export default getCostAndRealized;
