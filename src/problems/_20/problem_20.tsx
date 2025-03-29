import { ReactElement, useEffect } from "react";

import { GRAPH_1 } from "@/data/graph.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_20.module.css";

export default function Problem_20(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();
    graph.set(GRAPH_1);
    graph.layoutForceDirected();

    trace([{ message: "Before We Begin" }, { graph }]);

    function isCyclicUtil(
      adj: number[][],
      id: number,
      visited: boolean[],
      recStack: boolean[],
    ) {
      graph.nodes[id].color = "warning";
      trace([{ message: `Visiting ${id}` }, { graph }]);

      if (recStack[id]) {
        graph.nodes[id].color = "success";
        trace([{ message: "Found the cycle" }, { graph }]);

        return true;
      }

      visited[id] = true;
      recStack[id] = true;

      for (const x of adj[id]) {
        if (!visited[x] && isCyclicUtil(adj, x, visited, recStack)) {
          return true;
        } else if (recStack[x]) {
          graph.nodes[x].color = "success";
          trace([{ message: "Found the cycle" }, { graph }]);
          return true;
        }
      }

      graph.nodes[id].color = "disabled";
      trace([{ message: `Backtrack from ${id}` }, { graph }]);

      recStack[id] = false;
      return false;
    }

    function isCyclic(adj: number[][]) {
      const V = adj.length;
      const visited = new Array(V).fill(false);
      const recStack = new Array(V).fill(false);

      for (let i = 0; i < V; i++) {
        const colorBackup = graph.nodes[i].color;
        graph.nodes[i].color = "primary";
        trace([{ message: `Start from ${i}` }, { graph }]);

        if (visited[i]) {
          graph.nodes[i].color = colorBackup;
          trace([{ message: "Already visited" }, { graph }]);
        } else if (isCyclicUtil(adj, i, visited, recStack)) {
          return true;
        }
      }

      return false;
    }

    const adj = GRAPH_1.map((row) =>
      row.reduce((acc, current, index) => {
        if (current === 1) {
          return [...acc, index];
        }

        return acc;
      }, [] as number[]),
    );

    const result = isCyclic(adj);
    if (!result) {
      trace([{ message: "No cycle found" }, { graph }]);
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
        <ButtonComponent variant="primary" disabled>
          Solve
        </ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <GraphTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
