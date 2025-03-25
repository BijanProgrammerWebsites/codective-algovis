import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogTracerRecord } from "@/records/log-tracer.record.ts";
import {
  Item,
  OldArrayTracerRecord,
} from "@/records/old-array-tracer.record.ts";

import { generatePointers } from "@/utils/generator.utils.ts";

export function useProblem121() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, OldArrayTracerRecord]>();

  const generateItems = (prices: string): Item[] => {
    const numbers = JSON.parse(prices) as number[];

    return numbers.map((x, index) => ({
      id: index.toString(),
      value: x.toString(),
      color: "default",
    }));
  };

  const traceBeforeWeBegin = (items: Item[]): void => {
    trace([{ message: "Before We Begin" }, { items }]);
  };

  const traceLowAndHigh = (items: Item[], low: number, high: number): void => {
    const pointers = generatePointers({ low, high });

    items[low].color = "primary";
    items[high].color = "primary";
    trace([{ message: "Set pointers" }, { items, pointers }]);

    items[low].color = "disabled";
    items[high].color = "disabled";
  };

  const traceUpdateMaxProfit = (
    items: Item[],
    low: number,
    high: number,
    currentProfit: number,
  ): void => {
    const pointers = generatePointers({ low, high });

    items[low].color = "success";
    items[high].color = "success";
    trace([
      { message: `Found a new maximum: ${currentProfit}` },
      { items, pointers },
    ]);

    items[low].color = "disabled";
    items[high].color = "disabled";
  };

  const traceFoundLowerPrice = (
    items: Item[],
    low: number,
    high: number,
  ): void => {
    const pointers = generatePointers({ low, high });

    items[low].color = "danger";
    items[high].color = "success";
    trace([{ message: "Found lower price" }, { items, pointers }]);

    items[low].color = "disabled";
    items[high].color = "disabled";
  };

  const traceDone = (
    items: Item[],
    low: number,
    high: number,
    maxProfit: number,
  ): void => {
    if (low === -1 || high === -1) {
      trace([{ message: "Max profit: 0" }, { items }]);
      return;
    }

    const pointers = generatePointers({ low, high });

    for (let i = low; i <= high; i++) {
      items[i].color = "primary";
    }

    trace([{ message: `Max profit: ${maxProfit}` }, { items, pointers }]);
  };

  return {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceLowAndHigh,
    traceUpdateMaxProfit,
    traceFoundLowerPrice,
    traceDone,
  };
}
