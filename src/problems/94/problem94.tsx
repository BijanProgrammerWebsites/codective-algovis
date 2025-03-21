import { ReactElement, useContext, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";

import { TracerContext } from "@/context/tracer.context.ts";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphTracerItem } from "@/items/graph-tracer.item..ts";
import { LogTracerItem } from "@/items/log-tracer.item..ts";

import { GraphNode, GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem94.module.css";

const G: number[][] = [
  // G[i][j] indicates whether the path from the i-th node to the j-th node exists or not
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

export default function Problem94(): ReactElement {
  const { changeStep, setTotalSteps } = useContext(TracerContext);

  const [graphItems, traceGraph, resetGraph] = useTracer<GraphTracerItem>();
  const [logItems, traceLog, resetLog] = useTracer<LogTracerItem>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();
    graph.set(G);
    graph.layoutTree(5);

    trace({ message: "Start", graph });

    const dfs = (node: GraphNode): void => {
      const linkedNodes = graph.findLinkedNodes(node.id);

      for (let i = 0; i < linkedNodes.length; i++) {
        if (linkedNodes[i].visitedCount === 0) {
          graph.visit(linkedNodes[i].id, node.id);
          trace({ message: `Visiting ${linkedNodes[i].id}`, graph });

          dfs(linkedNodes[i]);
        }
      }
    };

    const root = graph.findNode(5)!;
    graph.visit(root.id);
    trace({ message: `Visiting ${root.id}`, graph });

    dfs(root);

    trace({ message: "End", graph });

    return;
  };

  const reset = (): void => {
    resetGraph();
    resetLog();
    changeStep(0);
    setTotalSteps(0);
  };

  const trace = ({
    message,
    graph,
  }: {
    message: LogTracerItem["message"];
    graph: GraphTracerItem["graph"];
  }): void => {
    traceGraph({ graph });
    traceLog({ message });
    setTotalSteps((old) => old + 1);
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <BoardComponent>
        <GraphTracer items={graphItems} />
        <LogTracer items={logItems} />
      </BoardComponent>
    </div>
  );
}
