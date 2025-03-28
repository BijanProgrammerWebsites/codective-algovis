import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem94.module.css";

const G: number[][] = [
  [0, 1, 0, 0, 0, 1],
  [0, 0, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
];

export default function Problem94(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();
    graph.set(G);
    graph.layoutForceDirected();

    trace([{ message: "Start" }, { graph }]);

    const dfs = (node: GraphNode): void => {
      const linkedNodes = graph.findLinkedNodes(node.id);

      for (let i = 0; i < linkedNodes.length; i++) {
        if (linkedNodes[i].visitedCount === 0) {
          graph.visit(linkedNodes[i].id, node.id);
          trace([{ message: `Visiting ${linkedNodes[i].id}` }, { graph }]);

          dfs(linkedNodes[i]);
        }
      }
    };

    const root = graph.findNode(5)!;
    graph.visit(root.id);
    trace([{ message: `Visiting ${root.id}` }, { graph }]);

    dfs(root);

    trace([{ message: "End" }, { graph }]);

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
