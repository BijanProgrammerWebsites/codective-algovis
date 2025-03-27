import { useRef } from "react";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LinkedListRecord } from "@/records/linked-list.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

export function useLinkedListTracer() {
  const [records, trace, reset] = useTracer<[LogRecord, LinkedListRecord]>();

  const linkedList = useRef<LinkedListStructure>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapWithBackup = <T extends () => any>(callback: T): ReturnType<T> => {
    const colorsBackup = new Map(
      linkedList.current!.nodes.map((node) => [node.id, node.color]),
    );

    const result = callback();

    linkedList.current!.nodes.forEach((node) => {
      if (!colorsBackup.has(node.id)) {
        return;
      }

      node.color = colorsBackup.get(node.id)!;
    });

    return result;
  };

  const traceBeforeWeBegin = (structure: LinkedListStructure): void => {
    linkedList.current = structure;
    trace([
      { message: "Before We Begin" },
      { linkedList: linkedList.current! },
    ]);
  };

  const traceTraverse = (index: number): void => {
    wrapWithBackup(() => {
      linkedList.current!.nodes[index].color = "warning";

      trace([
        { message: `Traverse index ${index}` },
        { linkedList: linkedList.current! },
      ]);
    });
  };

  const traceDone = (): void => {
    trace([{ message: "Done" }, { linkedList: linkedList.current! }]);
  };

  return {
    records,
    trace,
    reset,
    traceBeforeWeBegin,
    traceTraverse,
    traceDone,
  };
}
