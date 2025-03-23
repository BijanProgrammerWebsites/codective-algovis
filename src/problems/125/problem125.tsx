import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem125 } from "@/problems/125/use-problem125.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem125.module.css";

export default function Problem125(): ReactElement {
  const [s, setS] = useState<string>("radar");

  const {
    records,
    reset,
    generateItems,
    traceStart,
    traceCheck,
    traceNo,
    traceYes,
    traceIsPalindrome,
  } = useProblem125();

  const solve = (): void => {
    reset();

    const items = generateItems(s);
    traceStart(items);

    let left = 0;
    let right = items.length - 1;

    while (left <= right) {
      traceCheck(items, left, right);

      if (items[left].value !== items[right].value) {
        traceNo(items, left, right);
        return;
      }

      traceYes(items, left, right);

      left++;
      right--;
    }

    traceIsPalindrome(items);

    return;
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="s"
          type="text"
          value={s}
          onChange={(e) => setS(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <ArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
