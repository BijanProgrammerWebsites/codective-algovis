import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useProblem_1 } from "@/problems/_1/use-problem_1.ts";

import ArrayTracer from "@/tracers/array/array.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_1.module.css";

export default function Problem_1(): ReactElement {
  const [n, setN] = useState<string>("4");

  const { records, reset, traceDone } = useProblem_1();

  const solve = (): void => {
    reset();
    traceDone([]);
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
        <ArrayTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
