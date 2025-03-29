import { ReactElement, useEffect } from "react";

import { TREE_1 } from "@/data/tree.data.tsx";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { GraphRecord } from "@/records/graph.record.ts";
import { LogRecord } from "@/records/log.record.ts";
import { QueueRecord } from "@/records/queue.record.ts";

import { GraphStructure } from "@/structures/graph.structure.ts";
import { QueueStructure } from "@/structures/queue.structure.ts";

import GraphTracer from "@/tracers/graph/graph.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import styles from "./problem_16.module.css";

export default function Problem_16(): ReactElement {
  const [records, trace, reset] =
    useTracer<[LogRecord, GraphRecord, QueueRecord]>();

  const solve = (): void => {
    reset();

    const graph = new GraphStructure();
    graph.set(TREE_1);
    graph.layoutTree();

    const root = graph.findNode(0)!;

    const queue = new QueueStructure<number>();
    queue.enqueue(root.id);

    trace([{ message: "Before We Begin" }, { graph }, { queue }]);

    const bfs = (): void => {
      while (!queue.isEmpty()) {
        const id = queue.dequeue()!;
        const node = graph.findNode(id)!;

        node.visitedCount = 1;
        graph.colorNode(node.id, "primary");
        trace([{ message: `Visiting ${node.id}` }, { graph }, { queue }]);

        const linkedNodes = graph.findLinkedNodes(node.id);

        for (let i = 0; i < linkedNodes.length; i++) {
          if (linkedNodes[i].visitedCount === 0) {
            queue.enqueue(linkedNodes[i].id);
            graph.colorNode(linkedNodes[i].id, "warning");
            trace([
              { message: `Enqueue ${linkedNodes[i].id}` },
              { graph },
              { queue },
            ]);
          }
        }

        graph.colorNode(node.id, "success");
        trace([
          { message: `Visited ${node.id} completely` },
          { graph },
          { queue },
        ]);
      }
    };

    bfs();

    trace([{ message: "Done" }, { graph }, { queue }]);

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
      <BoardComponent layout="two-one-one-auto">
        <GraphTracer records={records.map((x) => x[1])} />
        <QueueTracer records={records.map((x) => x[2])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
