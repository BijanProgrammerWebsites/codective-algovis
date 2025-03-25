import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useArrayTracer } from "@/hooks/use-array-tracer.ts";

import { ArrayStatuses, ArrayStructure } from "@/structures/array.structure.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./problem704.module.css";

export default function Problem704(): ReactElement {
  const [nums, setNums] = useState<string>(
    "[2, 3, 10, 11, 33, 41, 50, 66, 68, 70, 79, 91]",
  );
  const [target, setTarget] = useState<string>("9");

  const { records, reset, traceBeforeWeBegin, traceAndReset, traceAll } =
    useArrayTracer();

  const solve = (): void => {
    reset();

    function t(
      start: number,
      mid: number,
      end: number,
      status: ColorType,
      message: string,
    ): void {
      const statuses: ArrayStatuses = {
        [start]: "primary",
        [end]: "primary",
        [mid]: status,
      };

      traceAndReset(statuses, message, { start, mid, end });
    }

    const parsedNums = JSON.parse(nums);
    const value = +target;

    const array = new ArrayStructure(parsedNums);
    traceBeforeWeBegin(array);

    let start = 0;
    let end = array.length - 1;
    let mid = Math.floor((start + end) / 2);

    t(start, mid, end, "primary", "Set pointers");

    while (start <= end) {
      mid = Math.floor((start + end) / 2);
      const x = array.cells[mid].value as number;

      t(start, mid, end, "warning", `Consider ${x}`);

      if (x > value) {
        t(start, mid, end, "danger", `${x} is greater than ${value}`);
        end = mid - 1;
      } else if (x < value) {
        t(start, mid, end, "danger", `${x} is less than ${value}`);
        start = mid + 1;
      } else {
        t(start, mid, end, "success", `${x} is equal ${value}`);
        traceAll("success", `Found ${value} at index ${mid}`);
        return;
      }
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
