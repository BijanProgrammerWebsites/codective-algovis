import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useLinkedListTracer } from "@/hooks/use-linked-list-tracer.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListTracer from "@/tracers/linked-list/linked-list.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_14.module.css";

export default function Problem_14(): ReactElement {
  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceCurrent,
    traceMessage,
    traceDone,
  } = useLinkedListTracer();

  const solve = (): void => {
    reset();

    const linkedList = new LinkedListStructure([0, 1, 2, 3, 4]);
    traceBeforeWeBegin(linkedList);

    const addCurrent = (index: number): void => {
      linkedList.nodes[index].color = "warning";
      linkedList.pointers.current = {
        index,
        position: "bottom",
      };
    };

    const removeCurrent = (index: number): void => {
      linkedList.nodes[index].color = "default";
      delete linkedList.pointers.current;
    };

    for (let i = 0; i < linkedList.nodes.length; i++) {
      traceCurrent(i);
    }

    addCurrent(linkedList.nodes.length - 1);
    linkedList.pointers.head.index = linkedList.nodes.length - 1;
    traceMessage("Update head");
    removeCurrent(linkedList.nodes.length - 1);

    for (let i = linkedList.nodes.length - 2; i >= 0; i--) {
      traceCurrent(i);

      addCurrent(i);

      delete linkedList.pointers.null;
      traceMessage("[VISUALIZATION] Remove current next");

      linkedList.addEdge({ source: i + 1, target: i });
      traceMessage("Add new next");

      linkedList.removeEdge(i, i + 1);
      linkedList.pointers.null = { index: i, position: "top" };
      traceMessage("Add null");

      removeCurrent(i);
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
