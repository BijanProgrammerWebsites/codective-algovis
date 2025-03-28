import { ReactElement, useEffect } from "react";

import { TREE_1 } from "@/data/tree.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_15.module.css";

export default function Problem_15(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();
    graph.set(TREE_1);
    graph.layoutTree();

    trace([{ message: "Before We Begin" }, { graph }]);

    const dfs = (node: GraphNode): void => {
      const linkedNodes = graph.findLinkedNodes(node.id);

      for (let i = 0; i < linkedNodes.length; i++) {
        if (linkedNodes[i].visitedCount === 0) {
          linkedNodes[i].visitedCount = 1;
          graph.colorToNode(node.id, linkedNodes[i].id, "warning");
          trace([{ message: `Visiting ${linkedNodes[i].id}` }, { graph }]);

          dfs(linkedNodes[i]);

          graph.colorToNode(node.id, linkedNodes[i].id, "success");
          trace([
            { message: `Visited ${linkedNodes[i].id} completely` },
            { graph },
          ]);
        }
      }
    };

    const root = graph.findNode(0)!;

    root.visitedCount = 1;
    graph.colorNode(root.id, "warning");
    trace([{ message: `Visiting ${root.id}` }, { graph }]);

    dfs(root);

    graph.colorNode(root.id, "success");
    trace([{ message: `Visited ${root.id} completely` }, { graph }]);

    trace([{ message: "Done" }, { graph }]);

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
