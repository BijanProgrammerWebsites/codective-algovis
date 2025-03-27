import { ReactElement, useEffect } from "react";

import BoardComponent from "@/components/board/board.component.tsx";
import { ButtonComponent } from "@/components/button/button.component.tsx";
import FormComponent from "@/components/form/form.component.tsx";

import { useTracer } from "@/hooks/use-tracer.hook.ts";

import { LinkedListRecord } from "@/records/linked-list.record.ts";
import { LogRecord } from "@/records/log.record.ts";

import { LinkedListStructure } from "@/structures/linked-list.structure.ts";

import LinkedListTracer from "@/tracers/linked-list/linked-list.tracer.tsx";
import LogTracer from "@/tracers/log/log.tracer.tsx";

import styles from "./problem_10.module.css";

export default function Problem_10(): ReactElement {
  const [records, trace, reset] = useTracer<[LogRecord, LinkedListRecord]>();

  const solve = (): void => {
    reset();

    const linkedList = new LinkedListStructure([1, 2, 3, 4, 5]);
    trace([{ message: "Before We Begin" }, { linkedList }]);
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
        <LinkedListTracer records={records.map((x) => x[1])} />
        <LogTracer records={records.map((x) => x[0])} />
      </BoardComponent>
    </div>
  );
}
