import { ReactElement, useEffect, useState } from "react";

import { GRAPH_3, GRAPH_3_VALUES } from "@/data/graph.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";
import { QueueRecord } from "@/records/queue.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";
import { QueueStructure } from "@/structures/queue.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import styles from "./problem_21.module.css";

export default function Problem_21(): ReactElement {
  const [targetState, setTargetState] = useState<string>("23");

  const [records, trace, reset] =
    useTracer<[LogRecord, GraphRecord, QueueRecord]>();

  const solve = (): void => {
    reset();

    const target = +targetState;

    const graph = new GraphStructure({ isWeighted: true });
    graph.fromArray(GRAPH_3, GRAPH_3_VALUES);
    graph.layoutForceDirected();

    const queue = new QueueStructure<number>();

    trace([{ message: "Before We Begin" }, { graph }, { queue }]);

    const visited = new Set<number>();

    function bfs(): boolean {
      while (!queue.isEmpty()) {
        const id = queue.dequeue()!;
        const node = graph.findNode(id)!;

        graph.colorNode(node.id, "primary");
        trace([{ message: `Visiting ${node.id}` }, { graph }, { queue }]);
        visited.add(id);

        if (graph.nodes[id].weight === target) {
          graph.nodes[id].color = "success";
          trace([{ message: `Found target at ${id}` }, { graph }, { queue }]);
          return true;
        }

        for (const adjacent of GRAPH_3[id]) {
          if (!visited.has(adjacent)) {
            queue.enqueue(adjacent);
            graph.colorNode(adjacent, "warning");
            trace([{ message: `Enqueue ${adjacent}` }, { graph }, { queue }]);
          }
        }

        graph.nodes[id].color = "disabled";
        trace([{ message: "End of itteration" }, { graph }, { queue }]);
      }

      return false;
    }

    function findTarget(): boolean {
      for (let i = 0; i < GRAPH_3.length; i++) {
        if (visited.has(i)) {
          const colorBackup = graph.nodes[i].color;
          graph.nodes[i].color = "primary";
          trace([{ message: `Already visited ${i}` }, { graph }, { queue }]);
          graph.nodes[i].color = colorBackup;
        } else {
          queue.enqueue(i);
          graph.nodes[i].color = "primary";
          trace([{ message: `Start from ${i}` }, { graph }, { queue }]);

          const result = bfs();
          if (result) {
            return true;
          }
        }
      }

      return false;
    }

    const result = findTarget();
    if (!result) {
      trace([{ message: "Target not found" }, { graph }, { queue }]);
    } else {
      trace([{ message: "Done" }, { graph }, { queue }]);
    }

    return;
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
      <BoardComponent layout="two-one-one-auto">
        <GraphTracer records={records.map((x) => x[1])} />
        <QueueTracer records={records.map((x) => x[2])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
