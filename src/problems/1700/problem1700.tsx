import { ReactElement, useEffect, useState } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";
import NormalInputComponent from "@/components/normal-input/normal-input.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LogRecord } from "@/records/log.record.ts";
import { QueueRecord } from "@/records/queue.record.ts";
import { StackRecord } from "@/records/stack.record.ts";

import { QueueStructure } from "@/structures/queue.structure.ts";
import { StackStructure } from "@/structures/stack.structure.ts";

import LogTracer from "@/tracers/log/log.tracer.tsx";
import QueueTracer from "@/tracers/queue/queue.tracer.tsx";
import StackTracer from "@/tracers/stack/stack.tracer.tsx";

import { ColorType } from "@/types/color.type.ts";

import styles from "./problem1700.module.css";

export default function Problem1700(): ReactElement {
  const [students, setStudents] = useState<string>("[1, 1, 0, 0]");
  const [sandwiches, setSandwiches] = useState<string>("[0, 1, 0, 1]");

  const [records, trace, reset] =
    useTracer<[LogRecord, QueueRecord, StackRecord]>();

  const solve = (): void => {
    reset();

    const parsedStudents = JSON.parse(students) as number[];
    const parsedSandwiches = JSON.parse(sandwiches) as number[];

    const stack = new StackStructure<number>();
    for (let i = parsedSandwiches.length - 1; i >= 0; i--) {
      stack.push2(parsedSandwiches[i]);
    }

    const queue = new QueueStructure<number>();
    for (let i = 0; i < parsedStudents.length; i++) {
      queue.enqueue(parsedStudents[i]);
    }

    trace([{ message: "Before We Begin" }, { queue }, { stack }]);

    function traceBoth(color: ColorType, message: string): void {
      const queueColorBackup = queue[0].color;
      const stackColorBackup = stack[stack.size() - 1].color;

      queue[0].color = color;
      stack[stack.size() - 1].color = color;

      trace([{ message }, { queue }, { stack }]);

      queue[0].color = queueColorBackup;
      stack[stack.size() - 1].color = stackColorBackup;
    }

    function countStudents(): number {
      let skippedCount = 0;

      while (skippedCount < queue.size()) {
        traceBoth("warning", "Does student take the sandwich?");

        const student = queue.front()!;
        const sandwich = stack.top()!;

        if (student === sandwich) {
          traceBoth("success", "Yes");

          queue.dequeue();
          stack.pop2();

          skippedCount = 0;
        } else {
          traceBoth("danger", "No");

          queue.dequeue();
          queue.enqueue(student);

          skippedCount++;
        }

        trace([{ message: "Pause" }, { queue }, { stack }]);
      }

      if (queue.size() > 0) {
        trace([
          { message: `${queue.size()} students left` },
          { queue },
          { stack },
        ]);
      } else {
        trace([{ message: "Done" }, { queue }, { stack }]);
      }

      return queue.size();
    }

    countStudents();
  };

  useEffect(() => {
    solve();
  }, []);

  return (
    <div className={styles.problem}>
      <FormComponent onSubmit={solve}>
        <NormalInputComponent
          label="students"
          type="text"
          value={students}
          onChange={(e) => setStudents(e.currentTarget.value)}
        />
        <NormalInputComponent
          label="sandwiches"
          type="text"
          value={sandwiches}
          onChange={(e) => setSandwiches(e.currentTarget.value)}
        />
        <ButtonComponent variant="primary">Solve</ButtonComponent>
      </FormComponent>
      <BoardComponent layout="two-one">
        <QueueTracer records={records.map((x) => x[1])} />
        <StackTracer records={records.map((x) => x[2])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
