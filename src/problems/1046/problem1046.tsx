import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useQueueTracer } from "@/hooks/use-queue-tracer.ts";

import { PriorityQueueStructure } from "@/structures/priority-queue.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./problem1046.module.css";

export default function Problem1046(): ReactElement {
  const [stones, setStones] = useState<string>("[2, 7, 4, 1, 8, 1]");

  const { records, trace, reset, traceBeforeWeBegin, traceDone } =
    useQueueTracer<number>();

  const solve = (): void => {
    reset();

    const parsedStones = JSON.parse(stones) as number[];

    const queue = new PriorityQueueStructure<number>((a, b) => a - b);
    for (let i = 0; i < parsedStones.length; i++) {
      queue.enqueue(parsedStones[i]);
    }

    traceBeforeWeBegin(queue);

    function traceOne(index: number, color: ColorType, message: string): void {
      const colorBackup = queue[index].color;
      queue[index].color = color;

      trace([{ message }, { queue }]);

      queue[index].color = colorBackup;
    }

    function traceBoth(
      a: number,
      b: number,
      color: ColorType,
      message: string,
    ): void {
      const firstColorBackup = queue[a].color;
      const secondColorBackup = queue[b].color;

      queue[a].color = color;
      queue[b].color = color;

      trace([{ message }, { queue }]);

      queue[a].color = firstColorBackup;
      queue[b].color = secondColorBackup;
    }

    function lastStoneWeight(): number {
      while (queue.size() > 1) {
        traceBoth(0, 1, "danger", `y: ${queue[0].value}, x: ${queue[1].value}`);

        const first = queue[0].value;
        const second = queue[1].value;

        if (first !== second) {
          queue.dequeue();
          queue.dequeue();

          queue.enqueue(first - second);

          trace([
            { message: "Keep the bigger one but reduce the weight" },
            { queue },
          ]);
        } else {
          queue.dequeue();
          queue.dequeue();

          trace([{ message: "Destroy Both" }, { queue }]);
        }
      }

      if (queue.isEmpty()) {
        trace([{ message: "Queue is empty, return 0" }, { queue }]);
        return 0;
      } else {
        traceOne(0, "primary", `Return ${queue[0].value}`);
        return queue[0].value;
      }
    }

    lastStoneWeight();

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
          value={stones}
          onChange={(e) => setStones(e.currentTarget.value)}
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
