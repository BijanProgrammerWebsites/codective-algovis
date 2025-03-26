import { ReactNode, useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { StackRecord } from "@/records/stack.record.ts";

import { StackStructure } from "@/structures/stack.structure.ts";

import { Methods } from "@/types/utils.type.ts";

import { stringify } from "@/utils/log.utils.ts";

export function useStackTracer<T extends ReactNode>() {
  const [records, trace, reset] = useTracer<[LogRecord, StackRecord]>();

  const stack = useRef<StackStructure<T>>(null);

  type Return<TMethod extends Methods<StackStructure<T>>> = ReturnType<
    StackStructure<T>[TMethod]
  >;

  const traceBeforeWeBegin = (structure: StackStructure<T>): void => {
    stack.current = structure;
    trace([{ message: "Before We Begin" }, { stack: stack.current! }]);
  };

  const tracePush2 = (value: T): Return<"push2"> => {
    stack.current!.push2(value);

    trace([
      { message: `Push2 ${stringify(value)}` },
      { stack: stack.current! },
    ]);
  };

  const tracePop2 = (): Return<"pop2"> => {
    const value = stack.current!.pop2();

    trace([{ message: `Pop2 ${stringify(value)}` }, { stack: stack.current! }]);

    return value;
  };

  const traceTop = (): Return<"top"> => {
    const value = stack.current!.top();

    stack.current!.colorTop("warning");

    trace([{ message: `Top: ${stringify(value)}` }, { stack: stack.current! }]);

    stack.current!.colorTop("default");

    return value;
  };

  const traceSize = (): Return<"size"> => {
    const value = stack.current!.size();

    trace([
      { message: `Size: ${stringify(value)}` },
      { stack: stack.current! },
    ]);

    return value;
  };

  const traceDone = (): void => {
    trace([{ message: "Done" }, { stack: stack.current! }]);
  };

  return {
    records,
    trace,
    reset,
    traceBeforeWeBegin,
    tracePush2,
    tracePop2,
    traceTop,
    traceSize,
    traceDone,
  };
}
