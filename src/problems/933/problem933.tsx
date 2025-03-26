import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useQueueTracer } from "@/hooks/use-queue-tracer.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import styles from "./problem933.module.css";

export default function Problem933(): ReactElement {
  const {
    records,
    reset,
    traceBeforeWeBegin,
    traceEnqueue,
    traceDequeue,
    traceFront,
    traceSize,
    traceDone,
  } = useQueueTracer<number>();

  const solve = (): void => {
    reset();

    const queue = new QueueStructure<number>();
    traceBeforeWeBegin(queue);

    function ping(t: number): void {
      traceEnqueue(t);

      while (traceFront()! < t - 3000) {
        traceDequeue();
      }

      traceSize();
    }

    ping(1);
    ping(100);
    ping(3001);
    ping(3002);

    traceDone();
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
