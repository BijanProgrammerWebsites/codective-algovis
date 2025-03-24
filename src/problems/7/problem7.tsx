import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useCallstackTracer } from "@/hooks/use-callstack-tracer.ts";

import { CallstackStructure } from "@/structures/callstack.structure.ts";

import CallstackTracer from "@/tracers/callstack/callstack.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem7.module.css";

export default function Problem7(): ReactElement {
  const [n, setN] = useState<string>("123");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceBeforeCall,
    traceCalled,
    traceReturning,
    traceReturned,
    traceStatement,
  } = useCallstackTracer();

  const solve = (): void => {
    reset();

    const callstack = new CallstackStructure();
    traceBeforeWeBegin(callstack, `n = ${n}`);

    function reverse(parentId: number, id: number, x: number): number {
      traceCalled(callstack, parentId, id, x);

      if (x === 0) {
        traceReturning(callstack, id, 0);
        return 0;
      }

      let isNegative = false;
      if (x < 0) {
        traceStatement(callstack, id, "x is negative; separate the sign");
        x = -x;
        isNegative = true;
      }

      const rank = Math.floor(Math.log10(x));
      const digit = x % 10;
      traceStatement(callstack, id, `Digit: ${digit}`);

      const reversedDigit = digit * Math.pow(10, rank);
      traceStatement(callstack, id, `Reversed digit: ${reversedDigit}`);

      const remainingDigits = Math.floor(x / 10);
      traceStatement(callstack, id, `Remaining digits: ${remainingDigits}`);

      traceBeforeCall(callstack, id, remainingDigits);
      const result = reverse(id, id + 1, remainingDigits);
      traceReturned(callstack, id, result);

      traceReturning(
        callstack,
        id,
        `${
          isNegative
            ? `-1 * (${reversedDigit} + ${result})`
            : `${reversedDigit} + ${result}`
        }`,
      );

      return (isNegative ? -1 : 1) * (reversedDigit + result);
    }

    traceBeforeCall(callstack, 0, +n);
    const result = reverse(0, 1, +n);
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
