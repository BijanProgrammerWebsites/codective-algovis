import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useLinkedListTracer } from "@/hooks/use-linked-list-tracer.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListTracer from "@/tracers/linked-list/linked-list.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_13.module.css";

export default function Problem_13(): ReactElement {
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

    for (let i = 0; i < targetIndex; i++) {
      traceCurrent(i);
    }

    linkedList.nodes[targetIndex - 1].color = "warning";
    linkedList.pointers.current = {
      index: targetIndex - 1,
      position: "bottom",
    };

    linkedList.addNode({
      id: 5,
      data: 5,
      color: "success",
      lay: (self) => {
        self.y =
          self.y +
          linkedList.dimensions.nodeHeight +
          2 * linkedList.dimensions.verticalGap;
      },
    });
    linkedList.nodes = [
      ...linkedList.nodes.slice(0, targetIndex),
      linkedList.nodes[linkedList.nodes.length - 1],
      ...linkedList.nodes.slice(targetIndex, linkedList.nodes.length - 1),
    ];
    traceMessage("Add node");

    linkedList.addEdge({ source: 5, target: targetIndex });
    traceMessage("Add new link");

    linkedList.edges.splice(targetIndex - 1, 1);
    traceMessage("[VISUALIZATION] Remove current link");

    linkedList.findNode(5)!.lay = undefined;
    traceMessage("[VISUALIZATION] Move");

    linkedList.addEdge({ source: targetIndex - 1, target: 5 });
    traceMessage("Add new link");

    linkedList.findNode(5)!.color = "default";
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
