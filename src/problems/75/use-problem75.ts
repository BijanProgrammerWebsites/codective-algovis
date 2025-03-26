import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { Item, OldArrayRecord } from "@/records/old-array.record.ts";

import { generatePointers } from "@/utils/generator.utils.ts";

export function useProblem75() {
  const [records, trace, reset] = useTracer<[LogRecord, OldArrayRecord]>();

  const generateItems = (nums: string): Item[] => {
    const numbers = JSON.parse(nums) as number[];

    return numbers.map((x, index) => ({
      id: index.toString(),
      value: x,
      color: "default",
    }));
  };

  const traceBeforeWeBegin = (items: Item[]): void => {
    trace([{ message: "Before We Begin" }, { items }]);
  };

  const tracePointers = (
    items: Item[],
    left: number,
    mid: number,
    right: number,
  ): void => {
    const pointers = generatePointers({ left, mid, right });

    trace([{ message: "Move pointers" }, { items, pointers }]);
  };

  const traceZero = (
    items: Item[],
    left: number,
    mid: number,
    right: number,
  ): void => {
    const pointers = generatePointers({ left, mid, right });

    items[mid].color = "primary";
    trace([{ message: "`mid` is 0" }, { items, pointers }]);

    items[left].color = "primary";
    trace([{ message: "Should be swapped with `left`" }, { items, pointers }]);
  };

  const traceOne = (
    items: Item[],
    left: number,
    mid: number,
    right: number,
  ): void => {
    const pointers = generatePointers({ left, mid, right });

    items[mid].color = "primary";
    trace([{ message: "`mid` is 1; Skip" }, { items, pointers }]);

    items[mid].color = "disabled";
  };

  const traceTwo = (
    items: Item[],
    left: number,
    mid: number,
    right: number,
  ): void => {
    const pointers = generatePointers({ left, mid, right });

    items[mid].color = "primary";
    trace([{ message: "`mid` is 2" }, { items, pointers }]);

    items[right].color = "primary";
    trace([{ message: "Should be swapped with `right`" }, { items, pointers }]);
  };

  const traceSwap = (
    items: Item[],
    left: number,
    mid: number,
    right: number,
    swap: number,
  ): void => {
    const pointers = generatePointers({ left, mid, right });

    items[mid].color = "primary";
    items[swap].color = "primary";
    trace([{ message: "Swap" }, { items, pointers }]);

    items[mid].color = "disabled";
    items[swap].color = "disabled";
  };

  const traceDone = (items: Item[]): void => {
    trace([{ message: "Done" }, { items }]);
  };

  return {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    tracePointers,
    traceZero,
    traceOne,
    traceTwo,
    traceSwap,
    traceDone,
  };
}
