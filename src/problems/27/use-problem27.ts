import { useTracer } from "@/hooks/use-tracer.hook.ts";

import {
  ArrayTracerRecord,
  Item,
  Pointers,
} from "@/records/array-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

export function useProblem27() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, ArrayTracerRecord]>();

  const generatePointers = (left: number, right: number): Pointers => {
    return {
      [left]: "left",
      [right]: left === right ? "left & right" : "right",
    };
  };

  const generateItems = (nums: string): Item[] => {
    const numbers = JSON.parse(nums) as number[];

    return numbers.map((x, index) => ({
      id: index.toString(),
      value: x.toString(),
      color: "default",
    }));
  };

  const traceBeforeWeBegin = (items: Item[]): void => {
    trace([{ message: "Before We Begin" }, { items }]);
  };

  const traceLeftAndRight = (
    items: Item[],
    left: number,
    right: number,
  ): void => {
    const pointers = generatePointers(left, right);

    trace([{ message: `Initialize pointers` }, { items, pointers }]);
  };

  const traceCheck = (
    items: Item[],
    left: number,
    right: number,
    index: number,
  ): void => {
    const pointers = generatePointers(left, right);

    items[index].color = "primary";
    trace([
      { message: `Should swap ${items[index].value}?` },
      { items, pointers },
    ]);
  };

  const traceContinue = (
    items: Item[],
    left: number,
    right: number,
    index: number,
  ): void => {
    const pointers = generatePointers(left, right);

    items[index].color = "success";
    trace([{ message: `No, continue` }, { items, pointers }]);

    items[index].color = "disabled";
  };

  const traceStop = (
    items: Item[],
    left: number,
    right: number,
    index: number,
  ): void => {
    const pointers = generatePointers(left, right);

    items[index].color = "danger";
    trace([{ message: `Yes, stop` }, { items, pointers }]);
  };

  const traceBreak = (items: Item[], left: number, right: number): void => {
    const pointers = generatePointers(left, right);

    items[left].color = "disabled";
    items[right].color = "disabled";
    trace([{ message: "`left` passed `right`" }, { items, pointers }]);
  };

  const traceSwap = (items: Item[], left: number, right: number): void => {
    const pointers = generatePointers(left, right);

    items[left].color = "success";
    items[right].color = "success";
    trace([{ message: "Swap" }, { items, pointers }]);

    items[left].color = "disabled";
    items[right].color = "disabled";
  };

  const traceContinueBoth = (
    items: Item[],
    left: number,
    right: number,
  ): void => {
    const pointers = generatePointers(left, right);

    trace([{ message: `Continue` }, { items, pointers }]);
  };

  const traceDone = (items: Item[], k: number): void => {
    for (let i = 0; i < k; i++) {
      items[i].color = "primary";
    }

    trace([{ message: `k = ${k}` }, { items }]);
  };

  return {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceLeftAndRight,
    traceCheck,
    traceContinue,
    traceStop,
    traceBreak,
    traceSwap,
    traceContinueBoth,
    traceDone,
  };
}
