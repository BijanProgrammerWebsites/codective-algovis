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

import styles from "./problem_14.module.css";

export default function Problem_14(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();

    graph.addNode({ id: 0, title: "A" });
    graph.addNode({ id: 1, title: "B" });
    graph.addNode({ id: 2, title: "C" });
    graph.addNode({ id: 3, title: "D" });
    graph.addNode({ id: 4, title: "E" });
    graph.addNode({ id: 5, title: "F" });
    graph.addNode({ id: 6, title: "G" });
    graph.addNode({ id: 7, title: "H" });
    graph.addNode({ id: 8, title: "I" });
    graph.addNode({ id: 9, title: "J" });
    graph.addNode({ id: 10, title: "K" });

    graph.addEdge({ source: 0, target: 1 });
    graph.addEdge({ source: 0, target: 2 });
    graph.addEdge({ source: 1, target: 3 });
    graph.addEdge({ source: 1, target: 4 });
    graph.addEdge({ source: 2, target: 5 });
    graph.addEdge({ source: 2, target: 6 });
    graph.addEdge({ source: 2, target: 7 });
    graph.addEdge({ source: 3, target: 8 });
    graph.addEdge({ source: 3, target: 9 });
    graph.addEdge({ source: 4, target: 10 });

    graph.layoutTree();

    trace([{ message: "Tree" }, { graph }]);

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
