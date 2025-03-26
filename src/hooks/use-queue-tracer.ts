import { ReactNode, useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { QueueRecord } from "@/records/queue.record.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

import { Methods } from "@/types/utils.type.ts";

import { stringify } from "@/utils/log.utils.ts";

export function useQueueTracer<T extends ReactNode>() {
  const [records, trace, reset] = useTracer<[LogRecord, QueueRecord]>();

  const queue = useRef<QueueStructure<T>>(null);

  type Return<TMethod extends Methods<QueueStructure<T>>> = ReturnType<
    QueueStructure<T>[TMethod]
  >;

  const traceBeforeWeBegin = (structure: QueueStructure<T>): void => {
    queue.current = structure;
    trace([{ message: "Before We Begin" }, { queue: queue.current! }]);
  };

  const traceEnqueue = (value: T): Return<"enqueue"> => {
    queue.current!.enqueue(value);

    trace([
      { message: `Enqueue ${stringify(value)}` },
      { queue: queue.current! },
    ]);
  };

  const traceDequeue = (): Return<"dequeue"> => {
    const value = queue.current!.dequeue();

    trace([
      { message: `Dequeue ${stringify(value)}` },
      { queue: queue.current! },
    ]);

    return value;
  };

  const traceFront = (): Return<"front"> => {
    const value = queue.current!.front();

    queue.current!.colorFront("warning");

    trace([
      { message: `Front: ${stringify(value)}` },
      { queue: queue.current! },
    ]);

    queue.current!.colorFront("default");

    return value;
  };

  const traceSize = (): Return<"size"> => {
    const value = queue.current!.size();

    const colorsBackup = queue.current!.colorAll("primary");

    trace([
      { message: `Size: ${stringify(value)}` },
      { queue: queue.current! },
    ]);

    queue.current!.colorAll(colorsBackup);

    return value;
  };

  const traceDone = (): void => {
    trace([{ message: "Done" }, { queue: queue.current! }]);
  };

  return {
    records,
    reset,
    traceBeforeWeBegin,
    traceEnqueue,
    traceDequeue,
    traceFront,
    traceSize,
    traceDone,
  };
}
