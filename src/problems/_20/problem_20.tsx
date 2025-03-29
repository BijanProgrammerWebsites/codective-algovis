import { ReactElement, useEffect, useState } from "react";

import { GRAPH_2, GRAPH_2_VALUES } from "@/data/graph.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_20.module.css";

export default function Problem_20(): ReactElement {
  const [targetState, setTargetState] = useState<string>("23");

  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const target = +targetState;

    const graph = new GraphStructure({ isWeighted: true });
    graph.fromArray(GRAPH_2, GRAPH_2_VALUES);
    graph.layoutForceDirected();

    trace([{ message: "Before We Begin" }, { graph }]);

    const visited = new Set<number>();

    function dfs(id: number): boolean {
      graph.nodes[id].color = "warning";
      trace([{ message: `Visiting ${id}` }, { graph }]);
      visited.add(id);

      if (graph.nodes[id].weight === target) {
        graph.nodes[id].color = "success";
        trace([{ message: `Found target at ${id}` }, { graph }]);
        return true;
      }

      for (const adjacent of GRAPH_2[id]) {
        if (!visited.has(adjacent)) {
          const result = dfs(adjacent);
          if (result) {
            return true;
          }
        }
      }

      graph.nodes[id].color = "disabled";
      trace([{ message: `Backtracking from ${id}` }, { graph }]);

      return false;
    }

    function findTarget(): boolean {
      for (let i = 0; i < GRAPH_2.length; i++) {
        if (visited.has(i)) {
          const colorBackup = graph.nodes[i].color;
          graph.nodes[i].color = "primary";
          trace([{ message: `Already visited ${i}` }, { graph }]);
          graph.nodes[i].color = colorBackup;
        } else {
          graph.nodes[i].color = "primary";
          trace([{ message: `Start from ${i}` }, { graph }]);

          const result = dfs(i);
          if (result) {
            return true;
          }
        }
      }

      return false;
    }

    const result = findTarget();
    if (!result) {
      trace([{ message: "Target not found" }, { graph }]);
    } else {
      trace([{ message: "Done" }, { graph }]);
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
      <BoardComponent>
        <GraphTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
