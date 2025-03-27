import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useLinkedListTracer } from "@/hooks/use-linked-list-tracer.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListTracer from "@/tracers/linked-list/linked-list.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_12.module.css";

export default function Problem_12(): ReactElement {
  const [targetState, setTargetState] = useState<string>("2");

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

    const targetIndex = +targetState;

    const linkedList = new LinkedListStructure([0, 1, 2, 3, 4]);
    traceBeforeWeBegin(linkedList);

    linkedList.nodes[targetIndex].color = "danger";
    linkedList.pointers.target = {
      index: targetIndex,
      position: "bottom",
    };
    traceMessage("Show target");

    for (let i = 0; i < targetIndex; i++) {
      traceCurrent(i);
    }

    linkedList.nodes[targetIndex - 1].color = "warning";
    linkedList.pointers.current = {
      index: targetIndex - 1,
      position: "bottom",
    };

    linkedList.nodes[targetIndex].offsetY =
      linkedList.dimensions.nodeHeight + linkedList.dimensions.verticalGap;
    traceMessage("[VISUALIZATION] move target down");

    linkedList.edges.splice(targetIndex - 1, 1);
    traceMessage("Remove current link");

    linkedList.addEdge({ source: targetIndex - 1, target: targetIndex + 1 });
    traceMessage("Add new link");

    delete linkedList.pointers.target;
    linkedList.removeNode(targetIndex);
    linkedList.removeEdge(targetIndex, targetIndex + 1);
    traceMessage("Garbage collection");

    linkedList.nodes[targetIndex - 1].color = "default";
    delete linkedList.pointers.current;

    traceDone();
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="target"
          type="text"
          value={targetState}
          onChange={(e) => setTargetState(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <LinkedListTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
