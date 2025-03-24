import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useCallstackTracer } from "@/hooks/use-callstack-tracer.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

import CallstackTracer from "@/tracers/callstack/callstack.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_1.module.css";

export default function Problem_1(): ReactElement {
  const [n, setN] = useState<string>("4");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceBeforeCall,
    traceCalled,
    traceReturning,
    traceReturned,
  } = useCallstackTracer();

  const solve = (): void => {
    reset();

    const callstack = new CallstackStructure();
    traceBeforeWeBegin(callstack, `n = ${n}`);

    function factorial(parentId: number, id: number, n: number): number {
      traceCalled(callstack, parentId, id, n);

      if (n === 1) {
        traceReturning(callstack, id, 1);
        return 1;
      }

      traceBeforeCall(callstack, id, n - 1);
      const result = factorial(id, id + 1, n - 1);
      traceReturned(callstack, id, result);

      traceReturning(callstack, id, `${n} * ${result}`);
      return n * result;
    }

    traceBeforeCall(callstack, 0, +n);
    const result = factorial(0, 1, +n);
    traceReturned(callstack, 0, result);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="n"
          type="text"
          value={n}
          onChange={(e) => setN(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <CallstackTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
