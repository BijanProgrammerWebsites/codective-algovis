import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useStackTracer } from "@/hooks/use-stack-tracer.ts";

import { StackStructure } from "@/structures/stack.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import StackTracer from "@/tracers/stack/stack.tracer.tsx";

import styles from "./problem_9.module.css";

export default function Problem_9(): ReactElement {
  const { records, reset, traceBeforeWeBegin, tracePush2, tracePop2 } =
    useStackTracer<number>();

  const solve = (): void => {
    reset();

    const stack = new StackStructure<number>();
    traceBeforeWeBegin(stack);

    tracePush2(1);
    tracePush2(2);
    tracePush2(3);
    tracePop2();
    tracePop2();
    tracePush2(4);
    tracePush2(5);
    tracePop2();
    tracePop2();
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <ButtonComponent variant="primary" disabled>
          Solve
        </ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <StackTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
