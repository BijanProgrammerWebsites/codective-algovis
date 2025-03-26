import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useQueueTracer } from "@/hooks/use-queue-tracer.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import styles from "./problem2073.module.css";

export default function Problem2073(): ReactElement {
  const [tickets, setTickets] = useState<string>("[2, 3, 2]");
  const [k, setK] = useState<string>("2");

  const { records, trace, reset, traceBeforeWeBegin, traceDone } =
    useQueueTracer<number>();

  const solve = (): void => {
    reset();

    const parsedTickets = JSON.parse(tickets) as number[];

    const queue = new QueueStructure<number>();
    for (let i = 0; i < parsedTickets.length; i++) {
      queue.enqueue(parsedTickets[i]);
    }

    traceBeforeWeBegin(queue);

    function timeRequiredToBuy(): number {
      let index = +k;
      let time = 0;

      while (queue.size() > 1) {
        queue[index].color = "warning";
        if (time === 0) {
          trace([{ message: "Highlight target" }, { queue }]);
        }

        time++;

        const front = queue.front()!;
        const colorBackup = queue[0].color;
        queue[0].color = "primary";
        trace([{ message: `Front: ${front}` }, { queue }]);
        queue[0].color = colorBackup;

        let item = queue.dequeue()!;
        index--;

        item--;

        if (item !== 0) {
          queue.enqueue(item);

          if (index === -1) {
            queue[queue.size() - 1].color = "warning";
          }

          trace([{ message: "Buy ticket and requeue" }, { queue }]);
        } else if (index !== -1) {
          trace([{ message: "Leave the queue" }, { queue }]);
        }

        if (index === -1) {
          if (item === 0) {
            trace([{ message: "Bought all needed tickets" }, { queue }]);

            return time;
          }

          index = queue.size() - 1;
        }
      }

      return time + queue.dequeue()!;
    }

    const result = timeRequiredToBuy();
    trace([{ message: `Result: ${result}` }, { queue }]);

    traceDone();
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="tickets"
          type="text"
          value={tickets}
          onChange={(e) => setTickets(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="k"
          type="text"
          value={k}
          onChange={(e) => setK(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent>
        <QueueTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
