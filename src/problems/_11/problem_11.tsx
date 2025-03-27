import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useLinkedListTracer } from "@/hooks/use-linked-list-tracer.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListTracer from "@/tracers/linked-list/linked-list.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_11.module.css";

export default function Problem_11(): ReactElement {
  const { records, reset, traceBeforeWeBegin, traceTraverse, traceDone } =
    useLinkedListTracer();

  const solve = (): void => {
    reset();

    const linkedList = new LinkedListStructure([0, 1, 2, 3, 4]);
    traceBeforeWeBegin(linkedList);

    for (let i = 0; i < linkedList.nodes.length; i++) {
      traceTraverse(i);
    }

    traceDone();
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
        <LinkedListTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
