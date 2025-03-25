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

import styles from "./problem_4.module.css";

export default function Problem_4(): ReactElement {
  const [nums, setNums] = useState<string>("[5, 1, 1, 2, 0, 0]");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceAndReset,
    traceIndex,
    traceAll,
  } = useArrayTracer();

  const solve = (): void => {
    reset();

    function t(index: number, status: ColorType, message: string): void {
      const statuses: ArrayStatuses = {
        [index]: "primary",
        [index + 1]: status,
      };

      traceAndReset(statuses, message, { index, next: index + 1 });
    }

    const parsedNums = JSON.parse(nums);

    const array = new ArrayStructure<number>(parsedNums);
    traceBeforeWeBegin(array);

    for (let i = 0; i < array.cells.length; i++) {
      if (i === 0) {
        traceIndex(0, "primary", "Start");
      } else {
        traceIndex(0, "primary", "Start over");
      }

      for (let j = 0; j < array.cells.length - 1 - i; j++) {
        t(
          j,
          "warning",
          `${array.cells[j].value} > ${array.cells[j + 1].value} ?`,
        );

        if (array.cells[j].value > array.cells[j + 1].value) {
          t(j, "danger", `Yes, swap`);

          const temp = array.cells[j];
          array.cells[j] = array.cells[j + 1];
          array.cells[j + 1] = temp;

          continue;
        }

        t(j, "success", `No, continue`);
      }
    }

    traceAll("success", "Array sorted successfully");
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
