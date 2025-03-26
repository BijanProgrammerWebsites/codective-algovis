import { ReactNode, useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { QueueRecord } from "@/records/queue.record.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

import { stringify } from "@/utils/log.utils.ts";

export function useQueueTracer<T extends ReactNode>() {
  const [records, trace, reset] = useTracer<[LogRecord, QueueRecord]>();

  const queue = useRef<QueueStructure>(null);

  const traceBeforeWeBegin = (structure: QueueStructure<T>): void => {
    queue.current = structure;
    trace([{ message: "Before We Begin" }, { queue: queue.current! }]);
  };

  const traceEnqueue = (value: T): void => {
    queue.current!.enqueue(value);

    trace([
      { message: `Enqueue ${stringify(value)}` },
      { queue: queue.current! },
    ]);
  };

  const traceDequeue = (): void => {
    const value = queue.current!.dequeue();

    trace([
      { message: `Dequeue ${stringify(value)}` },
      { queue: queue.current! },
    ]);
  };

  return {
    records,
    reset,
    traceBeforeWeBegin,
    traceEnqueue,
    traceDequeue,
  };
}
