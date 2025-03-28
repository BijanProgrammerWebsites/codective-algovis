import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_18.module.css";

export default function Problem_18(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure({ isWeighted: true });

    graph.addNode({ id: 0, weight: 8 });
    graph.addNode({ id: 1, weight: 3 });
    graph.addNode({ id: 2, weight: 10 });
    graph.addNode({ id: 3, weight: 1 });
    graph.addNode({ id: 4, weight: 6 });
    graph.addNode({ id: 5, weight: 14 });

    graph.addEdge({ source: 0, target: 1 });
    graph.addEdge({ source: 0, target: 2 });
    graph.addEdge({ source: 1, target: 3 });
    graph.addEdge({ source: 1, target: 4 });
    graph.addEdge({ source: 2, target: 5 });

    graph.layoutTree();

    trace([{ message: "Binary Search Tree (BST)" }, { graph }]);

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
