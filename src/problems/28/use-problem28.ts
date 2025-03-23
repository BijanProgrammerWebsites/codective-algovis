import { useTracer } from "@/hooks/use-tracer.hook.ts";

import {
  ArrayTracerRecord,
  Item,
  Pointers,
} from "@/records/array-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

export function useProblem28() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, ArrayTracerRecord, ArrayTracerRecord]>();

  const generateHaystackPointers = (
    start: number,
    index?: number,
  ): Pointers => {
    if (typeof index === "number") {
      return {
        [start + index]: "start+index",
      };
    }

    return {
      [start]: "start",
    };
  };

  const generateNeedlePointers = (index: number): Pointers => {
    return {
      [index]: "index",
    };
  };

  const generateItems = (text: string): Item[] => {
    return text.split("").map((character, index) => ({
      id: text + index.toString(),
      value: character,
      color: "default",
    }));
  };

  const traceBeforeWeBegin = (
    haystackItems: Item[],
    needleItems: Item[],
  ): void => {
    trace([
      { message: "Before We Begin" },
      { items: haystackItems },
      { items: needleItems },
    ]);
  };

  const traceInitStart = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start);

    trace([
      { message: "Initialize `start`" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems },
    ]);
  };

  const traceBoth = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
    index: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start, index);
    const needlePointers = generateNeedlePointers(index);

    trace([
      { message: "Move pointers" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems, pointers: needlePointers },
    ]);
  };

  const traceCheck = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
    index: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start, index);
    const needlePointers = generateNeedlePointers(index);

    haystackItems[start + index].color = "primary";
    needleItems[index].color = "primary";
    trace([
      { message: "Is equal?" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems, pointers: needlePointers },
    ]);
  };

  const traceMatched = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
    index: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start, index);
    const needlePointers = generateNeedlePointers(index);

    haystackItems[start + index].color = "success";
    needleItems[index].color = "success";
    trace([
      { message: "Yes" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems, pointers: needlePointers },
    ]);

    haystackItems[start + index].color = "disabled";
    needleItems[index].color = "disabled";
  };

  const traceUnmatched = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
    index: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start, index);
    const needlePointers = generateNeedlePointers(index);

    haystackItems[start + index].color = "danger";
    needleItems[index].color = "danger";
    trace([
      { message: "No" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems, pointers: needlePointers },
    ]);

    haystackItems[start + index].color = "disabled";
    needleItems[index].color = "disabled";
  };

  const traceFound = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
  ): void => {
    const haystackPointers = generateHaystackPointers(start);

    trace([
      { message: `Found substring at ${start}` },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems },
    ]);
  };

  const traceNotFound = (haystackItems: Item[], needleItems: Item[]): void => {
    trace([
      { message: `Not found` },
      { items: haystackItems },
      { items: needleItems },
    ]);
  };

  return {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    traceInitStart,
    traceBoth,
    traceCheck,
    traceMatched,
    traceUnmatched,
    traceFound,
    traceNotFound,
  };
}
