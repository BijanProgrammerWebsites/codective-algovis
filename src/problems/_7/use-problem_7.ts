import { useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { MultiArray, MultiArrayRecord } from "@/records/multi-array.record.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

export function useProblem_7() {
  const [records, trace, reset] = useTracer<[LogRecord, MultiArrayRecord]>();

  const arrays = useRef<MultiArray>(null);

  const id = (left: number, right: number, merge: boolean = false): string => {
    return `${left}:${right}${merge ? ":merge" : ""}`;
  };

  const get = (
    left?: number,
    right?: number,
    merge: boolean = false,
  ): ArrayStructure<number> => {
    if (typeof left !== "number" || typeof right !== "number") {
      return arrays.current!["root"].array;
    }

    return arrays.current![id(left, right, merge)]?.array;
  };

  const traceBeforeWeBegin = (structures: MultiArray): void => {
    arrays.current = structures;
    trace([{ message: "Before We Begin" }, { arrays: arrays.current }]);
  };

  const traceCreate = (
    left: number,
    right: number,
    col: number,
    depth: number,
  ): void => {
    arrays.current![id(left, right)] = {
      array: new ArrayStructure(
        get()
          .cells.slice(left, right + 1)
          .map((cell) => cell.value),
      ),
      col,
      depth,
    };

    trace([
      { message: `Created a new array from ${left} to ${right}` },
      { arrays: arrays.current! },
    ]);
  };

  const traceBeforeMerge = (
    left: number,
    mid: number,
    right: number,
    col: number,
    depth: number,
    maxDepth: number,
  ): void => {
    const leftArray = get(left, mid);
    const rightArray = get(mid + 1, right);

    arrays.current![id(left, right, true)] = {
      array: new ArrayStructure<number>(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        Array.from({ length: leftArray.length + rightArray.length }, () => ""),
      ),
      col,
      depth,
      merge: true,
      maxDepth: maxDepth,
    };

    trace([
      { message: `Merging from ${left} to ${right}...` },
      { arrays: arrays.current! },
    ]);
  };

  const traceAfterMerge = (left: number, mid: number, right: number): void => {
    const leftArray = get(left, mid);
    const rightArray = get(mid + 1, right);
    const mergedArray = get(left, right, true);

    mergedArray.colorize("success");

    leftArray.colorize("default");
    rightArray.colorize("default");

    trace([{ message: `Merged successfully` }, { arrays: arrays.current! }]);

    mergedArray.colorize("default");
  };

  const tracePutMerge = (
    left: number,
    mid: number,
    right: number,
    leftIndex: number,
    rightIndex: number,
    mergedIndex: number,
    isLeft: boolean,
    value: number,
  ): void => {
    const leftArray = get(left, mid, true) || get(left, mid);
    const rightArray = get(mid + 1, right, true) || get(mid + 1, right);
    const mergedArray = get(left, right, true);

    const leftCell = leftArray.cells[leftIndex];
    const rightCell = rightArray.cells[rightIndex];
    const mergedCell = mergedArray.cells[mergedIndex - left];

    leftArray.pointers = leftCell ? { left: leftIndex } : {};
    rightArray.pointers = rightCell ? { right: rightIndex } : {};
    mergedArray.pointers = mergedCell ? { merge: mergedIndex - left } : {};

    if (leftCell) leftCell.status = "warning";
    if (rightCell) rightCell.status = "warning";
    if (mergedCell) mergedCell.status = "default";

    trace([{ message: `Comparing...` }, { arrays: arrays.current! }]);

    if (leftCell) leftCell.status = isLeft ? "success" : "danger";
    if (rightCell) rightCell.status = isLeft ? "danger" : "success";
    if (mergedCell) mergedCell.status = "primary";

    mergedCell.value = value;

    trace([{ message: `Place` }, { arrays: arrays.current! }]);

    leftArray.pointers = {};
    rightArray.pointers = {};
    mergedArray.pointers = {};

    if (leftCell) leftCell.status = "default";
    if (rightCell) rightCell.status = "default";
  };

  const traceMessage = (message: string): void => {
    trace([{ message }, { arrays: arrays.current! }]);
  };

  return {
    records,
    reset,
    traceBeforeWeBegin,
    traceCreate,
    traceBeforeMerge,
    traceAfterMerge,
    tracePutMerge,
    traceMessage,
  };
}
