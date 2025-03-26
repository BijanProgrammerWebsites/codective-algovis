import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useQueueTracer } from "@/hooks/use-queue-tracer.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import styles from "./problem_8.module.css";

export default function Problem_8(): ReactElement {
  const { records, reset, traceBeforeWeBegin, traceEnqueue, traceDequeue } =
    useQueueTracer<number>();

  const solve = (): void => {
    reset();

    const queue = new QueueStructure<number>();
    traceBeforeWeBegin(queue);

    traceEnqueue(1);
    traceEnqueue(2);
    traceEnqueue(3);
    traceDequeue();
    traceDequeue();
    traceEnqueue(4);
    traceEnqueue(5);
    traceDequeue();
    traceDequeue();
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
        <QueueTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
