import { useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { ArrayTracerRecord } from "@/records/array-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

import {
  ArrayPointers,
  ArrayStatuses,
  ArrayStructure,
} from "@/structures/array.structure.ts";

import { ColorType } from "@/types/color.type.ts";

export function useArrayTracer() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, ArrayTracerRecord]>();

  const array = useRef<ArrayStructure>(null);

  const traceBeforeWeBegin = (structure: ArrayStructure): void => {
    array.current = structure;
    trace([{ message: "Before We Begin" }, { array: array.current }]);
  };

  const traceAndReset = (
    statuses: ArrayStatuses,
    message: string,
    pointers: ArrayPointers,
  ): void => {
    const previousPointers = { ...array.current!.pointers };
    const previousStatuses = array.current!.statuses;

    array.current!.pointers = { ...pointers };
    array.current!.updateStatuses(statuses);
    trace([{ message }, { array: array.current! }]);

    array.current!.pointers = { ...previousPointers };
    array.current!.updateAllStatuses(previousStatuses);
  };

  const traceIndex = (
    index: number,
    status: ColorType,
    message: string,
  ): void => {
    traceAndReset({ [index]: status }, message, { index });
  };

  const traceAll = (status: ColorType, message: string): void => {
    const previousStatuses = array.current!.statuses;

    array.current!.colorize(status);
    trace([{ message }, { array: array.current! }]);

    array.current!.updateAllStatuses(previousStatuses);
  };

  return {
    records,
    reset,
    traceBeforeWeBegin,
    traceAndReset,
    traceIndex,
    traceAll,
  };
}
