import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem75 } from "@/problems/75/use-problem75.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem75.module.css";

export default function Problem75(): ReactElement {
  const [nums, setNums] = useState<string>("[2, 0, 2, 1, 1, 0]");

  const {
    records,
    reset,
    generateItems,
    traceBeforeWeBegin,
    tracePointers,
    traceZero,
    traceOne,
    traceTwo,
    traceSwap,
    traceDone,
  } = useProblem75();

  const solve = (): void => {
    reset();

    const items = generateItems(nums);
    traceBeforeWeBegin(items);

    let left = 0;
    let mid = 0;
    let right = items.length - 1;

    while (mid <= right) {
      tracePointers(items, left, mid, right);

      if (items[mid].value === 0) {
        traceZero(items, left, mid, right);

        const temp = items[mid];
        items[mid] = items[left];
        items[left] = temp;
        traceSwap(items, left, mid, right, left);

        left++;
        mid++;
      } else if (items[mid].value === 1) {
        traceOne(items, left, mid, right);

        mid++;
      } else {
        traceTwo(items, left, mid, right);

        const temp = items[mid];
        items[mid] = items[right];
        items[right] = temp;
        traceSwap(items, left, mid, right, right);

        right--;
      }
    }

    traceDone(items);

    return;
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
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <ArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
