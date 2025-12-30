import { describe, it, expect } from "vitest";
import getCostAndRealized from "./get-cost-and-realized";
import { Action } from "./convert-to-actions";
import { scaleNumber } from "./scaled-number";
import bigIntToNumber from "./big-int-to-number";

// Define enums locally to avoid importing from files with Ponder dependencies
enum TradeType {
  MINT = "MINT",
  REDEEM = "REDEEM",
}

enum TransferType {
  TRANSFER_OUT = "transferOut",
  TRANSFER_IN = "transferIn",
}

const createAction = (
  type: TradeType | TransferType,
  baseAmount: number,
  leveragedTokenAmount: number,
  order: number
): Action => {
  return {
    type,
    baseAmount: scaleNumber(baseAmount, 6),
    leveragedTokenAmount: scaleNumber(leveragedTokenAmount, 18),
    time: new Date(order),
  };
};

describe("getCostAndRealized", () => {
  it("should calculate cost and realized for a simple mint and redeem", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 1000, 100, 1),
      createAction(TradeType.REDEEM, 1200, 100, 2),
    ];
    const result = getCostAndRealized(actions);
    expect(result.cost).toBe(0n);
    expect(result.realized).toBe(scaleNumber(200, 6));
  });

  it("should handle partial redemption", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 1000, 100, 1),
      createAction(TradeType.REDEEM, 600, 50, 2),
    ];
    const result = getCostAndRealized(actions);
    expect(result.cost).toBe(scaleNumber(500, 6));
    expect(result.realized).toBe(scaleNumber(100, 6));
  });

  it("should handle two stepped redemptions", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 1000, 100, 1),
      createAction(TradeType.REDEEM, 600, 50, 2),
      createAction(TradeType.REDEEM, 600, 50, 3),
    ];
    const result = getCostAndRealized(actions);
    expect(result.cost).toBe(0n);
    expect(result.realized).toBe(scaleNumber(200, 6));
  });

  it("should handle multiple mints", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 1000, 100, 1),
      createAction(TradeType.MINT, 1500, 100, 2),
    ];
    const result = getCostAndRealized(actions);
    expect(result.cost).toBe(scaleNumber(2500, 6));
    expect(result.realized).toBe(0n);
  });

  it("should handle transfer out", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 1000, 100, 1),
      createAction(TransferType.TRANSFER_OUT, 0, 50, 2),
    ];
    const result = getCostAndRealized(actions);
    expect(result.cost).toBe(scaleNumber(500, 6));
    expect(result.realized).toBe(0n);
  });

  it("should handle complex sequence of mints and redemptions", () => {
    const actions: Action[] = [
      createAction(TradeType.MINT, 100, 57.253224453563575, 1),
      createAction(TradeType.REDEEM, 19.922026, 10, 2),
      createAction(TradeType.REDEEM, 40.918635, 20, 3),
      createAction(TradeType.MINT, 59.928056, 32.7505554836724, 4),
      createAction(TradeType.REDEEM, 115.510346, 60.003779937235976, 5),
    ];
    const result = getCostAndRealized(actions);
    expect(bigIntToNumber(result.realized, 6)).toBeCloseTo(16.4229510054, 3);
  });
});
