import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useArrayTracer } from "@/hooks/use-array-tracer.ts";

import { ArrayStructure } from "@/structures/array.structure.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_3.module.css";

export default function Problem_3(): ReactElement {
  const [nums, setNums] = useState<string>("[8, 15, 4, 16, 23, 42]");
  const [target, setTarget] = useState<string>("23");

  const { records, reset, traceBeforeWeBegin, traceIndex, traceAll } =
    useArrayTracer();

  const solve = (): void => {
    reset();

    const parsedNums = JSON.parse(nums);
    const value = +target;

    const array = new ArrayStructure(parsedNums);
    traceBeforeWeBegin(array);

    for (let index = 0; index < parsedNums.length; index++) {
      traceIndex(index, "warning", `${parsedNums[index]} === ${value} ?`);

      if (parsedNums[index] === value) {
        traceIndex(index, "success", "Yes");
        traceAll("success", `Found ${value} at index ${index}`);
        return;
      }

      traceIndex(index, "danger", "No");
    }

    traceAll("danger", `Array doesn't include ${value}`);
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
          label="target"
          type="text"
          value={target}
          onChange={(e) => setTarget(e.currentTarget.value)}
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
