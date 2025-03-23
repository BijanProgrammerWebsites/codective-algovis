import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem27 } from "@/problems/27/use-problem27.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem27.module.css";

export default function Problem27(): ReactElement {
  const [nums, setNums] = useState<string>("[3, 2, 2, 3]");
  const [val, setVal] = useState<string>("3");

  const {
    records,
    reset,
    generateItems,
    traceStart,
    traceLeftAndRight,
    traceCheck,
    traceContinue,
    traceStop,
    traceBreak,
    traceSwap,
    traceContinueBoth,
    traceDone,
  } = useProblem27();

  const solve = (): void => {
    reset();

    const items = generateItems(nums);
    traceStart(items);

    let left = 0;
    let right = items.length - 1;

    traceLeftAndRight(items, left, right);

    while (true) {
      traceCheck(items, left, right, left);
      while (items[left].value !== val && left <= right) {
        traceContinue(items, left, right, left);
        left++;
        traceCheck(items, left, right, left);
      }

      if (left > right) {
        traceBreak(items, left, right);
        break;
      }

      traceStop(items, left, right, left);

      traceCheck(items, left, right, right);
      while (items[right].value === val && left <= right) {
        traceContinue(items, left, right, right);
        right--;
        traceCheck(items, left, right, right);
      }

      if (left > right) {
        traceBreak(items, left, right);
        break;
      }

      traceStop(items, left, right, right);

      const temp = items[left];
      items[left] = items[right];
      items[right] = temp;
      traceSwap(items, left, right);

      left++;
      right--;
      traceContinueBoth(items, left, right);
    }

    traceDone(items, left);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="nums"
          type="text"
          value={nums}
          onChange={(e) => setNums(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="val"
          type="text"
          value={val}
          onChange={(e) => setVal(e.currentTarget.value)}
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
