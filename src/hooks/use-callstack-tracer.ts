import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { CallstackTracerRecord } from "@/records/callstack-tracer.record.ts";
import { LogTracerRecord } from "@/records/log-tracer.record.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

export function useCallstackTracer() {
  const [records, trace, reset] =
    useTracer<[LogTracerRecord, CallstackTracerRecord]>();

  const traceBeforeWeBegin = (
    callstack: CallstackStructure,
    statement: string,
  ): void => {
    callstack.addNode({
      id: 0,
      title: "main",
      statements: [statement],
    });

    trace([{ message: "Before We Begin" }, { callstack }]);
  };

  const traceBeforeCall = (
    callstack: CallstackStructure,
    currentId: number,
    ...args: (string | number)[]
  ): void => {
    const node = callstack.findNode(currentId)!;

    const statement = `Need to call f(${args.join(", ")})...`;

    callstack.updateNode({
      id: currentId,
      status: "warning",
      statements: [...node.statements, statement],
    });

    trace([{ message: statement }, { callstack }]);
  };

  const traceCalled = (
    callstack: CallstackStructure,
    parentId: number,
    currentId: number,
    ...args: (string | number)[]
  ): void => {
    const argsString = args.join(", ");
    const statement = `Called f(${argsString})`;

    callstack.addNode({
      id: currentId,
      title: `f(${argsString})`,
      statements: [],
    });

    callstack.addEdge({ source: parentId, target: currentId });

    trace([{ message: statement }, { callstack }]);
  };

  const traceReturning = (
    callstack: CallstackStructure,
    currentId: number,
    result: string | number,
  ): void => {
    const node = callstack.findNode(currentId)!;

    const statement = `return ${result}`;

    callstack.updateNode({
      id: currentId,
      status: "success",
      statements: [...node.statements, statement],
    });

    trace([{ message: statement }, { callstack }]);

    callstack.removeNode(currentId);
  };

  const traceReturned = (
    callstack: CallstackStructure,
    currentId: number,
    result: string | number,
  ): void => {
    const node = callstack.findNode(currentId)!;

    const statement = `Result returned as ${result}`;

    callstack.updateNode({
      id: currentId,
      status: "default",
      statements: [...node.statements, statement],
    });

    trace([{ message: statement }, { callstack }]);
  };

  return {
    records,
    reset,
    traceBeforeWeBegin,
    traceBeforeCall,
    traceCalled,
    traceReturning,
    traceReturned,
  };
}
