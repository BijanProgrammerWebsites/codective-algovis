import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { Item, OldArrayRecord } from "@/records/old-array.record.ts";

import { ColorType } from "@/types/color.type.ts";

import { generatePointers } from "@/utils/generator.utils.ts";

export function useProblem28() {
  const [records, trace, reset] =
    useTracer<[LogRecord, OldArrayRecord, OldArrayRecord]>();

  const colorize = (
    items: Item[],
    from: number,
    to: number,
    color: ColorType,
  ): void => {
    let i = from;

    while (i !== to) {
      items[i].color = color;
      i++;
    }

    items[i].color = color;
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
    const haystackPointers = generatePointers({ start });

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
    const haystackPointers = generatePointers({ start, index: start + index });
    const needlePointers = generatePointers({ index });

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
    const haystackPointers = generatePointers({ start, index: start + index });
    const needlePointers = generatePointers({ index });

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
    const haystackPointers = generatePointers({ start, index: start + index });
    const needlePointers = generatePointers({ index });

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
    const haystackPointers = generatePointers({ start, index: start + index });
    const needlePointers = generatePointers({ index });

    haystackItems[start + index].color = "danger";
    needleItems[index].color = "danger";
    trace([
      { message: "No" },
      { items: haystackItems, pointers: haystackPointers },
      { items: needleItems, pointers: needlePointers },
    ]);

    colorize(haystackItems, start, start + index, "default");
    haystackItems[start].color = "disabled";

    colorize(needleItems, 0, needleItems.length - 1, "default");
  };

  const traceFound = (
    haystackItems: Item[],
    needleItems: Item[],
    start: number,
  ): void => {
    const haystackPointers = generatePointers({ start });

    for (let index = 0; index < needleItems.length; index++) {
      haystackItems[start + index].color = "primary";
      needleItems[index].color = "primary";
    }

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
