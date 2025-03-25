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

import styles from "./problem_5.module.css";

export default function Problem_5(): ReactElement {
  const [nums, setNums] = useState<string>("[5, 1, 1, 2, 0, 0]");

  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceAndReset,
    traceAll,
    tracePause,
  } = useArrayTracer();

  const solve = (): void => {
    reset();

    function t(
      indexOfMin: number,
      index: number,
      status: ColorType,
      message: string,
    ): void {
      const statuses: ArrayStatuses = {
        [indexOfMin]: "primary",
        [index]: status,
      };

      traceAndReset(statuses, message, { min: indexOfMin, index });
    }

    const parsedNums = JSON.parse(nums);

    const array = new ArrayStructure<number>(parsedNums);
    traceBeforeWeBegin(array);

    for (let i = 0; i < array.cells.length; i++) {
      let min = array.cells[i].value;
      let indexOfMin = i;

      traceAndReset(
        { [indexOfMin]: "primary" },
        i === 0 ? "Start" : "Start over",
        { min: indexOfMin },
      );

      for (let j = i + 1; j < array.cells.length; j++) {
        t(indexOfMin, j, "warning", `${array.cells[j].value} < ${min} ?`);

        if (array.cells[j].value < min) {
          t(indexOfMin, j, "success", "Yes, change");
          min = array.cells[j].value;
          indexOfMin = j;

          continue;
        }

        t(indexOfMin, j, "danger", "No, continue");
      }

      traceAndReset({ [indexOfMin]: "primary", [i]: "primary" }, "Swap", {
        min: indexOfMin,
        place: i,
      });
      array.swap(i, indexOfMin);

      tracePause();
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
