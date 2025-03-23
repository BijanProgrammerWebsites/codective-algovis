import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { ArrayTracerRecord, Item } from "@/records/array-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

import { ColorType } from "@/types/color.type.ts";

import { generatePointers } from "@/utils/generator.utils.ts";

export function useProblem1652() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, ArrayTracerRecord, ArrayTracerRecord]>();

  const colorize = (
    items: Item[],
    from: number,
    to: number,
    color: ColorType,
    isBackward?: boolean,
  ): void => {
    let i = from;

    while (i !== to) {
      items[i].color = color;

      i = isBackward ? i - 1 + items.length : i + 1;
      i %= items.length;
    }

    items[i].color = color;
  };

  const generateCodeItems = (code: string): Item[] => {
    const numbers = JSON.parse(code) as number[];

    return numbers.map((character, index) => ({
      id: `code-${index.toString()}`,
      value: character,
      color: "default",
    }));
  };

  const generateResultItems = (code: string): Item[] => {
    const numbers = JSON.parse(code) as number[];

    return numbers.map((_, index) => ({
      id: `result-${index.toString()}`,
      value: "",
      color: "default",
    }));
  };

  const traceBeforeWeBegin = (codeItems: Item[], resultItems: Item[]): void => {
    trace([
      { message: "Before We Begin" },
      { items: codeItems },
      { items: resultItems },
    ]);
  };

  const traceSum = (
    codeItems: Item[],
    resultItems: Item[],
    start: number,
    end: number,
    index: number,
    sum: number,
    isBackward?: boolean,
  ): void => {
    const codePointers = generatePointers({ start, end, index });
    const resultPointers = generatePointers({ index });

    colorize(codeItems, start, end, "success", isBackward);
    codeItems[index].color = "primary";
    trace([
      { message: `Sum: ${sum}` },
      { items: codeItems, pointers: codePointers },
      { items: resultItems, pointers: resultPointers },
    ]);
  };

  const tracePush = (
    codeItems: Item[],
    resultItems: Item[],
    start: number,
    end: number,
    index: number,
    isBackward?: boolean,
  ): void => {
    const codePointers = generatePointers({ start, end, index });
    const resultPointers = generatePointers({ index });

    colorize(codeItems, start, end, "success", isBackward);
    codeItems[index].color = "primary";
    resultItems[index].color = "success";
    trace([
      { message: "Add to results" },
      { items: codeItems, pointers: codePointers },
      { items: resultItems, pointers: resultPointers },
    ]);

    resultItems[index].color = "primary";
  };

  const traceDone = (codeItems: Item[], resultItems: Item[]): void => {
    colorize(codeItems, 0, codeItems.length - 1, "default");
    trace([{ message: "Done" }, { items: codeItems }, { items: resultItems }]);
  };

  return {
    records,
    reset,
    generateCodeItems,
    generateResultItems,
    traceBeforeWeBegin,
    traceSum,
    tracePush,
    traceDone,
  };
}
