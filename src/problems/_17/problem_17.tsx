import { ReactElement, useEffect } from "react";

import {
  BTREE_1,
  BTREE_2,
  BTREE_3,
  BTREE_4,
  BTREE_6,
} from "@/data/tree.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_17.module.css";

export default function Problem_17(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, GraphRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();

    graph.set(BTREE_1);
    graph.layoutTree();
    trace([{ message: "Binary Tree" }, { graph }]);

    graph.set(BTREE_2);
    graph.layoutTree();
    trace([{ message: "Full Binary Tree" }, { graph }]);

    graph.set(BTREE_3);
    graph.layoutTree();
    trace([{ message: "Perfect Binary Tree" }, { graph }]);

    graph.set(BTREE_4);
    graph.layoutTree();
    trace([{ message: "Degenerate or Pathological Binary Tree" }, { graph }]);

    graph.set(BTREE_2);
    graph.layoutTree();
    trace([{ message: "Complete Binary Tree" }, { graph }]);

    graph.set(BTREE_6);
    graph.layoutTree();
    trace([{ message: "Balanced Binary Tree" }, { graph }]);

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
